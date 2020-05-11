import { Espaco, Resultado } from "models-minha-palestra";
import UsuarioHelper from "./UsuarioHelper";
import firebase from "firebase";
import "firebase/database";
import LogHelper from "./LogHelper";


export default class EspacosHelper{
    /**
     * @param {Espaco["prototype"]} espaco
     * @returns {Promise.<Espaco["prototype"]>}
     */
    static salvar(espaco){
        return new Promise(async (resolve,reject)=>{
            let ok = true;
            if(!(espaco instanceof Espaco)){
                reject(new Resultado(-1, "Espaço inválido.", null, {espaco}));
                return;
            }
            if(!espaco.nome||!espaco.limiteDePessoas||!espaco.tamanho||!espaco.tipo){
                reject(new Resultado(-1, "Um espaço deve possuir obrigatoriamente um nome, limite de ocupantes, tamanho e tipo.", null, {espaco}));
                return;
            }
            let usuario = await UsuarioHelper.getUsuarioAtual()
            .catch(err=>{
                reject(err);
                ok = false;
            })
            if(!ok) return;
            if(espaco.path){
                LogHelper.logarECommitar([espaco.path, usuario.path], "ATUALIZACAO", undefined, espaco)
                .then(()=>{
                    resolve(espaco);
                })
                .catch(err=>{
                    reject(new Resultado(-2, "Erro ao criar espaço.", err, {espaco}));
                })
            }
            else{
                espaco.dhCriacao = new Date();
                espaco.usuarioCriador = usuario.path;
                let ref = await firebase.database().ref("Espacos").push()
                .catch(err=>{
                    ok = false;
                    reject(new Resultado(-1, "Erro ao criar referência do espaço.", err, {espaco}));
                })
                if(!ok) return;
                espaco.path = ref.path.toString();
                LogHelper.logarECommitar([espaco.path, usuario.path], "CRIACAO", undefined, espaco)
                .then(()=>{
                    resolve(espaco);
                })
                .catch(err=>{
                    reject(new Resultado(-2, "Erro ao criar espaço.", err, {espaco}));
                })
            }
        });
    }
    /**
     * @returns {Promise<Array<Espaco["prototype"]>>}
     */
    static listar(includeDesabilitados){
        return new Promise(async (resolve,reject)=>{
            let ref = firebase.database().ref("Espacos");
            if(!includeDesabilitados) ref = ref.orderByChild("habilitado").equalTo(true)
            ref.once("value").then(snaps=>{
                let espacos = [];
                snaps.forEach(snap=>{
                    espacos.push(new Espaco().parse(snap.ref.path.toString(), snap.val()));
                })
                resolve(espacos);
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar espaços.", err, {includeDesabilitados}));
            })
        });
    }
    /**
     * 
     * @param {string} path 
     * @returns {Promise.<Espaco["prototype"]>}
     */
    static buscar(path){
        return new Promise(async (resolve,reject)=>{
            if(!path){
                reject(new Resultado(-1, "Espaço indefinido!", null, {path}));
            }
            firebase.database().ref(path).once("value")
            .then(snap=>{
                if(!snap.exists()) reject(new Resultado(-2, "Espaço não encontrado!", null, {path}));
                else resolve(new Espaco().parse(snap.ref.path.toString(), snap.val()));
            })
            .catch(err=>{
                reject(new Resultado(-2, "Erro ao buscar espaço!", err, {path}));
            })
        });
    }
}