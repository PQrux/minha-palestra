import firebase from "firebase";
import "firebase/database";
import { FirestoreObject, Resultado } from "models-minha-palestra";
/**
 * Realiza um join na base de dados, baseando-se em um FirestoreObject ou uma string referencial.
 * @param {FirestoreObject|String} base FirestoreObject ou string referencial.
 * @param {function(new:FirestoreObject)} baseConstructor Construtor da base, extendido de FirestoreObject.
 * @param {Object<string, function(new:FirestoreObject)|FirestoreObject>} joiners Campos da base a serem joinados.
 * @returns {Promise.<Object<string, FirestoreObject>}
 */
export default function FirebaseJoiner(base, baseConstructor, joiners) {
    return new Promise(async (resolve, reject)=>{
        let ok = true;
        let checks = {base: true};
        let data = {base: base};
        if(!(base && baseConstructor && baseConstructor.prototype && (baseConstructor.prototype instanceof FirestoreObject))){
            reject(new Resultado(-1, "Erro: Sem base ou base constructor", null, {base, baseConstructor, joiners}));
            return;
        }
        if(typeof data.base === "string"){
            await firebase.database().ref(data.base).once("value").then((snap)=>{
                data.base = new baseConstructor().parse(data.base, snap.val());
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar informações da base.", err, {base, baseConstructor, joiners}));
                ok = false;
            })
            if(!ok) return;
        }
        else if(!(data.base instanceof baseConstructor)){
            reject(new Resultado(-1, "Erro: Base é de um tipo inválido.", null, {base, baseConstructor, joiners}));
            return;
        }
        for(let key in joiners){
            if(data.base[key] && joiners[key]){
                if((joiners[key] instanceof FirestoreObject)){
                    checks[key] = true;
                    data[key] = joiners[key];
                }
                else if(joiners[key].prototype && (joiners[key].prototype instanceof FirestoreObject)){
                    checks[key] = false;
                    data[key] = undefined;
                }
            }
        }
        let enviar = () => {
            for(let i in checks){
                if(!checks[i]) return;
            }
            resolve(data);
        }
        enviar();
        for(let key in checks){
            if(!checks[key]){
                firebase.database().ref(data.base[key]).once("value")
                .then(snap=>{
                    data[key] = new joiners[key]().parse(data.base[key], snap.val());
                    checks[key] = true;
                    enviar();
                })
                .catch(err=>{
                    checks[key] = true;
                    console.log(err);
                    enviar();
                })
            }
        }
    })

}