import { Resultado } from "models-minha-palestra";
import firebase from "firebase";
import "firebase/auth";
import secret from "../secret";
/**
 * 
 * @param {string} endpoint EndPoint da API.
 * @param {string="GET"} method Método HTTP, toma como padrão o método GET.method
 * @param {Object} body Objeto usado como body.
 */
export default function ApiReader(endpoint, method, body){
    return new Promise(async (resolve,reject)=>{
        method = method ? method : "GET";
        body = typeof body === "object" ? body : {};
        let token;
        if(firebase.auth().currentUser){
            token = await firebase.auth().currentUser.getIdToken()
            .catch(console.log);
        }
        body = Object.assign(body, {token});
        fetch(secret.API_ROOT+endpoint,{
            method,
            body: JSON.stringify(body),
        })
        .then(response=>{
            response.text()
            .then(text=>{
                try{
                    let json = JSON.parse(text);
                    if(response.status <= 299 && response.status >= 200){
                        resolve(json);
                    }
                    else{
                        reject(new Resultado(json.codigo, json.descricao, json.stackTrace, json.dados));
                    }
                }
                catch(err){
                    reject(new Resultado(-1, "Erro de retorno da API.", err, {endpoint, method, body, textResponse: text}));
                }
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro de retorno da API.", err, {endpoint, method, body}));
            })
        })
        .catch(err=>{
            reject(new Resultado(-1, "Erro de comunicação com a API.", err, {endpoint, method, body}));
        })
    });
}