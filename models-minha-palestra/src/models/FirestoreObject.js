const Resultado = require("./Resultado");

class FirestoreObject{
    /**
     * Representa um objeto que tem como origem a base de dados.
     * @param {String} path Caminho de acesso no firestore para o objeto.
     */
    constructor(path){
        this.criarAtributoReferencial("path", false);
        this.path = path;
    }
    /**
     * @protected
     * @param {string} vinculo 
     */
    addAtributoId(vinculo){
        let value;
        if((typeof vinculo !== "string")){
            vinculo = undefined;
        }
        Object.defineProperty(this, "id",{
            enumerable: true,
            configurable: true,
            get: () =>{
                if(vinculo && (typeof vinculo !== "object")){
                    let atrVinculado = this[vinculo];
                    if(typeof atrVinculado === "string"){
                        atrVinculado = atrVinculado.replace(/[\.\$\[\]\#\/]/g,"");
                    }
                    return atrVinculado;
                }
                else{
                    return value;
                }
            },
            set: (newValue) =>{
                if(!vinculo){
                    value = newValue;
                }
            }
        })
    }
    getUid(){
        let uid="";
        if(this.path){
            uid = this.path.split("/").pop();
        }
        return uid;
    }
    corrigirReferencia(value){
        if(typeof value === "string"){
            if(value[0] === "/"){
                value = value.substring(1,value.length);
            }
            if(value[value.length-1] === "/"){
                value = value.substring(0,value.length-1);
            }
        }
        return value;
    }
    /**
     * 
     * @param {String} nome 
     * @param {boolean} enumeravel 
     */
    criarAtributoReferencial(nome, enumeravel){
        let atributo;
        Object.defineProperty(this,nome,{
            configurable: true,
            enumerable: enumeravel ? true : false,
            get: ()=>{
                return atributo;
            },
            set: (value)=>{
                atributo = this.corrigirReferencia(value);
            }
        })
    }
    addRastreio(){
        this.dhCriacao = new Date();
        this.criarAtributoReferencial("usuarioCriador", true);
        /**@type {import("./Log")} */
        this.ultimoLog = {};
    }
    /**
     * Transforma o objeto em um objeto simples, para que o mesmo seja inserido no banco de dados.
     * @param {Object} target Realiza o processo de transformação em JSON sobre o objeto definido.
     * @returns {Object}
     */
    toJson(target){
        target = target instanceof Object ? target : this;
        let props = Object.getOwnPropertyNames(target);
        let simpleObject = JSON.parse(JSON.stringify(target));
        for(let i=0;i<props.length;i++){
            let prop = props[i];
            if(prop[0] === "_"){
                delete simpleObject[prop];
            }
            else if(target[prop] instanceof Date){
                if(target[prop].getTime()) simpleObject[prop] = target[prop].getTime();
            }
            else if(target[prop] instanceof FirestoreObject){
                simpleObject[prop] = target[prop].toJson();
            }
            else if(target[prop] instanceof Array){
                let arrayNaoAnonima = {};
                let isArrayNaoAnonima = false;
                for(let j=0;j<target[prop].length;j++){
                    let value = target[prop][j];
                    if(value instanceof Date){
                        if(value.getTime()) simpleObject[prop][j] = value.getTime();
                    }
                    else if(value instanceof FirestoreObject){
                        if(value.id){
                            isArrayNaoAnonima = true;
                            arrayNaoAnonima[value.id] = value.toJson();
                        }
                        else{
                            simpleObject[prop][j] = value.toJson();
                        }
                    }
                    else if(typeof value === "object"){
                        if(value.id){
                            isArrayNaoAnonima = true;
                            arrayNaoAnonima[value.id] = this.toJson(value);
                        }
                        else{
                            simpleObject[prop][j] = this.toJson(value);
                        }
                    }
                }
                if(isArrayNaoAnonima){
                    simpleObject[prop] = arrayNaoAnonima;
                }
            }
            else if(typeof target[prop] === "object" && target[prop] != null){
                simpleObject[prop] = this.toJson(target[prop]);
            }
        }
        return simpleObject;
    }
    /**
     * Transforma um objeto genérico extraído do banco de dados em um FirestoreObject.
     * @param {String} path Caminho de acesso do Objeto no banco de dados.
     * @param {Object} objetoGenerico Objeto a ter valores capturados.
     */
    parse(path, objetoGenerico){
        this.path = path;
        try{
            let propriedadesDoObjeto = Object.getOwnPropertyNames(objetoGenerico);
            for(let i=0; i<propriedadesDoObjeto.length; i++){
                if(this.hasOwnProperty(propriedadesDoObjeto[i])){
                    if(objetoGenerico[propriedadesDoObjeto[i]] != undefined){
                        if(this[propriedadesDoObjeto[i]] instanceof Date){
                            this[propriedadesDoObjeto[i]] = new Date(objetoGenerico[propriedadesDoObjeto[i]]);
                        }
                        else if((typeof objetoGenerico[propriedadesDoObjeto[i]] === "object")){
                            let isArrayNaoAnonima = false;
                            let keys = Object.getOwnPropertyNames(objetoGenerico[propriedadesDoObjeto[i]]);
                            if(objetoGenerico[propriedadesDoObjeto[i]][keys[0]] && objetoGenerico[propriedadesDoObjeto[i]][keys[0]].id){
                                isArrayNaoAnonima = true;
                            }
                            if(isArrayNaoAnonima){
                                let arrayNaoAnonima = [];
                                keys.forEach(key=>{
                                    arrayNaoAnonima.push(objetoGenerico[propriedadesDoObjeto[i]][key]);
                                })
                                this[propriedadesDoObjeto[i]] = arrayNaoAnonima;
                            }
                            else{
                                this[propriedadesDoObjeto[i]] = objetoGenerico[propriedadesDoObjeto[i]];
                            }
                        }
                        else{
                            this[propriedadesDoObjeto[i]] = objetoGenerico[propriedadesDoObjeto[i]];
                        }
                    }
                }
            }
            return this;
        }
        catch(err){
            throw new Resultado(-3423,"Impossível converter objeto.",err,{path: path, objetoGenerico: objetoGenerico});
        }
    }
}
module.exports =  FirestoreObject;