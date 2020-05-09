import { Palestra, Resultado, ParticipanteDePalestra } from "models-minha-palestra";
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
                palestra.aprovada = false;
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
    static listarPalestras(orderby, equalto){
        return new Promise(async (resolve,reject)=>{
            firebase.database().ref("Palestras").orderByChild(orderby).equalTo(equalto)
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
    /**
     * Inscreve ou desinscreve o usuário em uma palestra.
     * @param {Palestra["prototype"]} palestra 
     */
    static switchInscricaoEmPalestra(palestra){
        return new Promise(async (resolve,reject)=>{
            let ok = false;
            if(!(palestra instanceof Palestra)||!palestra.path){
                reject(new Resultado(-1, "Palestra inválida.", null, {palestra}));
                return;
            }
            if(!palestra.aprovada){
                reject(new Resultado(-1, "Você não pode se inscrever em palestras ainda não aprovadas.", null, {palestra}));
                return;
            }
            if(palestra.cancelada){
                reject(new Resultado(-1, "Você não pode se inscrever em palestras canceladas.", null, {palestra}));
                return;
            }
            if(palestra.finalizada){
                reject(new Resultado(-1, "Você não pode se inscrever em palestras finalizadas.", null, {palestra}));
                return;
            }
            const usuario = await UsuarioHelper.getUsuarioAtual()
            .catch(err=>{
                reject(err);
                ok = false;
            })
            if(!ok) return;
            if(palestra.participantes[usuario.getUid()] && palestra.participantes[usuario.getUid()].inscrito){
                firebase.database().ref(palestra.path).child("participantes").child(usuario.getUid()).remove()
                .then(()=>{
                    delete palestra.participantes[usuario.getUid()];
                    resolve(palestra);
                })
                .catch(err=>{
                    reject(new Resultado(-1, "Erro ao se desinscrever em palestra.", err, {palestra}));
                })
            }
            else{
                let obj = new ParticipanteDePalestra(usuario.path, usuario.nome, usuario.cpf, false);
                firebase.database().ref(palestra.path).child("participantes").child(usuario.getUid()).set(obj.toJson())
                .then(()=>{
                    palestra.participantes[usuario.getUid()] = obj;
                    resolve(palestra);
                })
                .catch(err=>{
                    reject(new Resultado(-1, "Erro ao se inscrever em palestra.", err, {palestra}));
                })
            }
        });
    }
}