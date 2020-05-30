import { Palestra, Resultado, ParticipanteDePalestra, Espaco, Evento, Usuario } from "models-minha-palestra";
import UsuarioHelper from "./UsuarioHelper";
import firebase from "firebase";
import "firebase/database";
import { LogHelper } from ".";
import { ApiReader, PDFFromJSON } from "../utils";
export default class PalestrasHelper{
    /**
     * 
     * @param {Palestra} palestra 
     */
    static finalizarPalestra(palestra){
        return new Promise(async (resolve,reject)=>{
            if(!(palestra instanceof Palestra)||!palestra.path){
                reject(new Resultado(-1, "Palestra inválida.", null, {palestra}));
                return;
            }
            palestra.finalizada = true;
            palestra.dhFinalizacao = new Date();
            LogHelper.logarECommitar([], "FINALIZACAO", "Finalização da palestra.", palestra)
            .then(()=>{
                resolve(palestra);
            })
            .catch(reject);
        });
    }
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
                if(usuario.grupo === "PALESTRANTE"){
                    palestra.palestrante = usuario.path;
                    palestra.nomePalestrante = usuario.nome;
                }
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
     * 
     * @returns {Promise<Palestra["prototype"]>}
     */
    static aprovarPalestra(palestra){
        return new Promise(async (resolve,reject)=>{
            if(!(palestra instanceof Palestra)||!palestra.path){
                reject(new Resultado(-1, "Palestra inválida.", null, {palestra}));
                return;
            }
            if(!palestra.espaco||!palestra.dhApresentacao||!palestra.palestrante){
                reject(new Resultado(-1, "Para ser aprovada a palestra precisa de um espaço de apresentação, um palestrante e uma data de apresentação!"));
                return;
            }
            palestra.aprovada = true;
            LogHelper.logarECommitar([palestra.path], "ATUALIZACAO", "Palestra aprovada.", palestra)
            .then(()=>{
                resolve(palestra);
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao salvar palestra.", err, {palestra}));
            })
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
     * @returns {Promise<boolean>}
     */
    static switchInscricaoEmPalestra(palestra){
        return new Promise(async (resolve,reject)=>{
            const usuario = await UsuarioHelper.getUsuarioAtual().catch(reject);
            if(!usuario) return;
            const inscrever = palestra.participantes[usuario.getUid()] ? false : true;
            ApiReader("/Palestras/"+(inscrever ? "inscrever" : "desinscrever"), "POST", {palestra: palestra.path})
            .then(()=>{
                if(inscrever) palestra.addParticipante(usuario);
                else palestra.removeParticipante(usuario);
                resolve(inscrever);
            })
            .catch(reject);
        });
    }
    /**
     * Gera o certificado de participação da palestra.
     * @param {Palestra["prototype"]} palestra 
     * @returns {Promise}
     */
    static gerarCerificado(palestra){
        return new Promise(async (resolve,reject)=>{
            if(!(palestra instanceof Palestra)||!palestra.path){
                reject(new Resultado(-1, "Palestra inválida.", null, {palestra}));
                return;
            }
            ApiReader("/Certificado/gerar", "POST", {palestra: palestra.path})
            .then((resp)=>{
                PDFFromJSON(resp, "Certificado "+palestra.nome);
                resolve();
            })
            .catch(reject);
        });
    }
    /**
     * Busca uma palestra específica na base de dados.
     * @param {string} path Referencia a palestra.
     * @returns {Promise.<Palestra["prototype"]>}
     */
    static buscarPalestra(path){
        return new Promise(async (resolve,reject)=>{
            if(!path){
                reject(new Resultado(-1, "Referência inválida!", null, {path}));
                return;
            }
            firebase.database().ref(path).once("value").then(snap=>{
                if(!snap.exists()){
                    reject(new Resultado(-1, "Palestra inexistente!", null, {path}));
                    return;
                }
                resolve(new Palestra().parse(snap.ref.path.toString(), snap.val()));
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar palestra!", err, {path}));
            })
        });
    }
}