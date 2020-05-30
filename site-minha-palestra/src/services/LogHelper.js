import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import { Log, Resultado } from "models-minha-palestra";
import UsuarioHelper from "./UsuarioHelper";

export default class LogHelper{
    /**
     * 
     * @param {Array<string>} registros Registros envolvidos no log.
     * @param {string} tipo Tipo de log.
     * @param {string} mensagem Mensagem de log.
     * @param {import("models-minha-palestra/src/models/FirestoreObject")} objetoAlvo
     * @returns {Promise.<Log["prototype"]>}
     */
    static logar(registros, tipo, mensagem, objetoAlvo){
        return new Promise(async (resolve,reject)=>{
            let ok = true;
            let log = await LogHelper.gerarLog(registros, tipo, mensagem)
            .catch((err)=>{
                reject(err);
                ok = false;
            });
            if(!ok) return;
            firebase.database().ref("Logs").push(log.toJson()).then(ref=>{
                log.path = ref.path.toString();
                if(objetoAlvo) objetoAlvo.ultimoLog = log;
                resolve(log);
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao salvar log.", err, {log}));
            })
        });
    }

    /**@returns {Log["prototype"]} */
    static gerarLog(registros, tipo, mensagem){
        return new Promise(async (resolve,reject)=>{
            UsuarioHelper.getUsuarioAtual().then(usuario=>{
                const log = new Log();
                if(registros && registros.forEach){
                    registros.forEach(registro=>{
                        if(registro) log.setRegistro(registro);
                    });
                }
                log.tipo = tipo;
                log.nomeUsuario = usuario.nome;
                log.mensagem = mensagem;
                log.usuarioAcao = usuario.path;
                log.dh = new Date();
                resolve(log);
            })
            .catch(err=>{
                reject(err);
            })
        });
    }
    /**
     * 
     * @param {Array<string>} registros Registros envolvidos no log.
     * @param {"CRIACAO"|"ATUALIZACAO"|"REMOCAO"} tipo Tipo de log.
     * @param {string} mensagem Mensagem de log.
     * @param {import("models-minha-palestra/src/models/FirestoreObject")} objetoAlvo
     * @returns {Promise}
     */
    static logarECommitar(registros, tipo, mensagem, objetoAlvo){
        return new Promise(async (resolve,reject)=>{
            let ok = true;
            let log = await LogHelper.gerarLog(registros, tipo, mensagem)
            .catch((err)=>{
                reject(err);
                ok = false;
            });
            if(!ok) return;
            firebase.database().ref("Logs").push().then(ref=>{
                log.path = ref.path.toString();
                objetoAlvo.ultimoLog = log;
                let updatingObject = {
                    [log.path]: log.toJson(),
                    [objetoAlvo.path]: objetoAlvo.toJson(),
                };
                firebase.database().ref().update(updatingObject).then(()=>{
                    resolve(objetoAlvo);
                })
                .catch(err=>{
                    reject(new Resultado(-1, "Erro ao salvar log.", err, {log}));
                })
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao salvar log.", err, {log}));
            })
        });
    }
}