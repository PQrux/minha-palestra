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
     * @returns {Promise.<Log["prototype"]>}
     */
    static logar(registros, tipo, mensagem){
        return new Promise(async (resolve,reject)=>{
            UsuarioHelper.getUsuarioAtual().then(usuario=>{
                let log = new Log();
                if(registros && registros.forEach){
                    registros.forEach(registro=>{
                        log.registros[registro] = true;
                    });
                }
                log.tipo = tipo;
                log.mensagem = mensagem;
                log.usuarioAcao = usuario.path;
                log.dh = firebase.database.ServerValue.TIMESTAMP;
                firebase.database().ref("Logs").push(log.toJson()).then(ref=>{
                    log.dh = new Date();
                    log.path = ref.path.toString();
                    resolve(log);
                })
                .catch(err=>{
                    reject(new Resultado(-1, "Erro ao salvar log.", err, {log}));
                })
            })
            .catch(err=>{
                reject(err);
            })
        });
    }
}