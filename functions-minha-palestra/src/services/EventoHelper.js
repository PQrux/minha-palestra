const { Evento, Resultado } = require("models-minha-palestra");
const firebase = require("firebase-admin");

module.exports = class EventoHelper{
    /**
     * 
     * @param {*} path 
     * @returns {Promise<Evento>}
     */
    static buscarEvento(path){
        return new Promise(async (resolve,reject)=>{
            if(!path){
                reject(new Resultado(-1, "Evento inválido!", null, {path}));
                return;
            }
            firebase.database().ref(path).once("value")
            .then(snap=>{
                if(!snap.exists()){
                    reject(new Resultado(-1, "Evento inexistente!", null, {path}));
                    return;
                }
                resolve(new Evento().parse(path, snap.val()));
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar evento!", err, {path}));
            })
        });
    }
}