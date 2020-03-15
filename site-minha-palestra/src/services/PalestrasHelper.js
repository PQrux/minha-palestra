import { Palestra, Resultado } from "models-minha-palestra";
import UsuarioHelper from "./UsuarioHelper";
import firebase from "firebase";
import "firebase/database";
import { LogHelper } from ".";
export default class PalestrasHelper{
    /**
     * @param {Palestra["prototype"]}
     */
    static salvarPalestra(palestra){
        return new Promise(async (resolve,reject)=>{
            let ok = true;
            if(!(palestra instanceof Palestra)){
                reject(new Resultado(-1, "Palestra inválida.", null, {palestra}));
                return;
            }
            let usuario = await UsuarioHelper.getUsuarioAtual()
            .catch(err=>{
                reject(err);
                ok = false;
            })
            if(!ok) return;
            if(palestra.path){
                LogHelper.logarECommitar([palestra.path, usuario.path], "ATUALIZACAO", undefined, palestra)
                .then(()=>{
                    resolve(palestra);
                })
                .catch(err=>{
                    reject(new Resultado(-2, "Erro ao criar palestra.", err, {palestra}));
                })
            }
            else{
                palestra.dhCriacao = new Date();
                palestra.aprovada = false;
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
            firebase.database().ref("Palestras").orderByChild("_aprovada_finalizada").equalTo("true_false")
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
    static listarPropostasDePalestra(){
        return new Promise(async (resolve,reject)=>{
            firebase.database().ref("Palestras").orderByChild("_aprovada_cancelada").equalTo("false_false")
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
}