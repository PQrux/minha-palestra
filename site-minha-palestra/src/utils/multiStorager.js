/**
 * 
 * @callback setCallback
 * @param {Resultado} error Erro durante execução.
 */
/**
 * 
 * @callback getCallback
 * @param {any} resultado Resultado da captura.
 * @param {Resultado} error Erro durante execução.
 */
class DataStorager{
    constructor(){
        this.data = {};
        this.listeners = {};
    }
    get(key){
        return this.data[key];
    }
    set(key,data){
        this.data[key] = data;
        if(this.listeners[key]){
            for(let i in this.listeners[key]){
                if(typeof this.listeners[key][i] === "function"){
                    this.listeners[key][i](data);
                }
            }
        }
    }
    delete(key){
        delete this.data[key];
        if(this.listeners[key]){
            for(let i in this.listeners[key]){
                if(typeof this.listeners[key][i] === "function"){
                    this.listeners[key][i](undefined);
                }
            }
        }
    }
    eraseAll(){
        this.data = {};
        for(let key in this.listeners){
            for(let i in this.listeners[key]){
                if(typeof this.listeners[key][i] === "function"){
                    this.listeners[key][i](undefined);
                }
            }
        }
    }
    /**
     * 
     * @param {string} key 
     * @param {function(any)} callback 
     */
    addListener(key, listenerKey, callback){
        if(!this.listeners[key]) this.listeners[key] = {};
        this.listeners[key][listenerKey] = callback;
        callback(this.data[key]);
    }
    deleteListener(key, listenerKey){
        if(this.listeners[key])
        delete this.listeners[key][listenerKey];
    }
    deleteAllListeners(key){
        delete this.listeners[key];
    }
}
class MultiStorager{
    constructor(){
        this.DataStorager = new DataStorager();
    }
}

const multiStorager = new MultiStorager();
export default multiStorager;