import { Evento, Resultado } from "models-minha-palestra";
import UsuarioHelper from "./UsuarioHelper";
import firebase from "firebase";
import "firebase/database";
import LogHelper from "./LogHelper";


export default class EventosHelper{
    /**
     * @param {Evento["prototype"]} evento
     * @returns {Promise.<Evento["prototype"]>}
     */
    static salvar(evento){
        return new Promise(async (resolve,reject)=>{
            let ok = true;
            if(!(evento instanceof Evento)){
                reject(new Resultado(-1, "Espaço inválido.", null, {evento}));
                return;
            }
            if(!evento.nome||!evento.inicio||!evento.termino||evento.inicio >= evento.termino){
                reject(new Resultado(-1, "Um evento deve obrigatóriamente possuir nome, início e termino.", null, {evento}));
                return;
            }
            let usuario = await UsuarioHelper.getUsuarioAtual()
            .catch(err=>{
                reject(err);
                ok = false;
            })
            if(!ok) return;
            if(evento.path){
                LogHelper.logarECommitar([evento.path, usuario.path], "ATUALIZACAO", undefined, evento)
                .then(()=>{
                    resolve(evento);
                })
                .catch(err=>{
                    reject(new Resultado(-2, "Erro ao criar evento.", err, {evento}));
                })
            }
            else{
                evento.dhCriacao = new Date();
                evento.usuarioCriador = usuario.path;
                let ref = await firebase.database().ref("Eventos").push()
                .catch(err=>{
                    ok = false;
                    reject(new Resultado(-1, "Erro ao criar referência do evento.", err, {evento}));
                })
                if(!ok) return;
                evento.path = ref.path.toString();
                LogHelper.logarECommitar([evento.path, usuario.path], "CRIACAO", undefined, evento)
                .then(()=>{
                    resolve(evento);
                })
                .catch(err=>{
                    reject(new Resultado(-2, "Erro ao criar evento.", err, {evento}));
                })
            }
        });
    }
    /**
     * @returns {Promise<Array<Evento["prototype"]>>}
     */
    static listar(){
        return new Promise(async (resolve,reject)=>{
            let ref = firebase.database().ref("Eventos");
            ref.once("value").then(snaps=>{
                let eventos = [];
                snaps.forEach(snap=>{
                    eventos.push(new Evento().parse(snap.ref.path.toString(), snap.val()));
                })
                resolve(eventos);
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar eventos.", err));
            })
        });
    }
    /**
     * 
     * @param {string} path 
     * @returns {Promise.<Evento["prototype"]>}
     */
    static buscar(path){
        return new Promise(async (resolve,reject)=>{
            if(!path){
                reject(new Resultado(-1, "Evento indefinido!", null, {path}));
            }
            firebase.database().ref(path).once("value")
            .then(snap=>{
                if(!snap.exists()) reject(new Resultado(-2, "Evento não encontrado!", null, {path}));
                else resolve(new Evento().parse(snap.ref.path.toString(), snap.val()));
            })
            .catch(err=>{
                reject(new Resultado(-2, "Erro ao buscar evento!", err, {path}));
            })
        });
    }
}