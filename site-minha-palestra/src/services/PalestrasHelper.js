import { Palestra, Resultado } from "models-minha-palestra";
import UsuarioHelper from "./UsuarioHelper";
import firebase from "firebase";
import "firebase/database";
import { LogHelper } from ".";
export default class PalestrasHelper{
    /**
     * @param {Palestra["prototype"]}
     */
    static salvarPalestra(palestra, acao){
        return new Promise(async (resolve,reject)=>{
            let ok = true;
            if(!(palestra instanceof Palestra)){
                reject(new Resultado(-1, "Palestra inválida.", null, {palestra}));
                return;
            }
            if(!palestra.nome){
                reject(new Resultado(-1, "Uma palestra precisa de um nome para ser salva!"));
                return;
            }/*
            if(!palestra.espaco||!palestra.palestrante||!palestra.nome||!palestra.dhApresentacao){
                reject(new Resultado(-1, "Para ser criada a palestra deve possuir um espaço, palestrante, nome e data de apresentação.", null, {palestra}));
                return;
            }*/
            let usuario = await UsuarioHelper.getUsuarioAtual()
            .catch(err=>{
                reject(err);
                ok = false;
            })
            if(!ok) return;
            if(palestra.path){
                LogHelper.logarECommitar([palestra.path, usuario.path], acao||"ATUALIZACAO", undefined, palestra)
                .then(()=>{
                    resolve(palestra);
                })
                .catch(err=>{
                    reject(new Resultado(-2, "Erro ao criar palestra.", err, {palestra}));
                })
            }
            else{
                palestra.dhCriacao = new Date();
                palestra.cancelada = false;
                palestra.finalizada = false;
                palestra.usuarioCriador = usuario.path;
                let ref = await firebase.database().ref("Palestras").push()
                .catch(err=>{
                    ok = false;
                    reject(new Resultado(-1, "Erro ao criar referência da palestra.", err, {palestra}));
                })
                if(!ok) return;
                palestra.path = ref.path.toString();
                LogHelper.logarECommitar([palestra.path, usuario.path], "CRIACAO", undefined, palestra)
                .then(()=>{
                    resolve(palestra);
                })
                .catch(err=>{
                    reject(new Resultado(-2, "Erro ao criar palestra.", err, {palestra}));
                })
            }
        });
    }
    /**
     * @returns {Promise<Palestra["prototype"]>}
     */
    static listarPalestrasDisponiveis(){
        return new Promise(async (resolve,reject)=>{
            firebase.database().ref("Palestras").orderByChild("finalizada").equalTo(false)
            .once("value").then(snaps=>{
                let palestras = [];
                snaps.forEach(snap=>{
                    palestras.push(new Palestra().parse(snap.ref.path.toString(), snap.val()));
                })
                resolve(palestras);
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar palestras.", err));
            })
        });
    }
    /**
     * @returns {Promise<Array<Palestra["prototype"]>>}
     */
    static listarPalestrasFinalizadasOuCanceladas(){
        return new Promise(async (resolve,reject)=>{
            firebase.database().ref("Palestras").orderByChild("finalizada").equalTo(true)
            .once("value").then(snaps=>{
                let palestras = [];
                snaps.forEach(snap=>{
                    palestras.push(new Palestra().parse(snap.ref.path.toString(), snap.val()));
                })
                resolve(palestras);
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar palestras.", err));
            })
        });
    }
    /**
     * 
     * @param {Palestra["prototype"]} palestra 
     */
    static cancelarPalestra(palestra){
        return new Promise(async (resolve,reject)=>{
            let ok = true;
            if(!(palestra instanceof Palestra)||!palestra.path){
                reject(new Resultado(-1, "Palestra inválida.", null, {palestra}));
                return;
            }
            let usuario = await UsuarioHelper.getUsuarioAtual()
            .catch(err=>{
                reject(err);
                ok = false;
            })
            if(!ok) return;
            if(usuario.grupo !== "ADMINISTRADOR"){
                reject(new Resultado(-1, "Você não tem permissão para cancelar uma palestra.", null, {palestra}));
                return;
            }
            palestra.cancelada = true;
            palestra.finalizada = true;
            palestra.dhFinalizacao = new Date();
            PalestrasHelper.salvarPalestra(palestra, "CANCELAMENTO").then(resolve).catch(reject);
        });
    }
}