const { Palestra, Resultado } = require("models-minha-palestra");
const firebase = require("firebase-admin");

module.exports = class PalestraHelper{
    static getPalestra(path){
        return new Promise(async (resolve,reject)=>{
            if(!path){
                reject(new Resultado(-1, "Palestra inválida!", null, {path}));
                return;
            }
            firebase.database().ref(path).once("value")
            .then(snap=>{
                if(!snap.exists()){
                    reject(new Resultado(-1, "Palestra inexistente!", null, {path}));
                    return;
                }
                resolve(new Palestra().parse(snap.ref.path.toString(), snap.val()));
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar palestra!", err, {path}));
            })
        });
    }
    static salvarPalestra(palestra){
        return new Promise(async (resolve,reject)=>{
            if(!(palestra instanceof Palestra)||!palestra.path){
                reject(new Resultado(-1, "Palestra inválida.", null, {palestra}));
                return;
            }
            firebase.database().ref(palestra.path).update(palestra.toJson())
            .then(()=>{
                resolve();
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao salvar palestra!", err, {palestra}));
            })
        });
    }
    static palestrasPorUsuarioEEvento(usuarioPath, eventoPath){
        return new Promise(async (resolve,reject)=>{
            const usuarioUid = usuarioPath ? usuarioPath.split("/").pop() : "undefined";
            firebase.database().ref("Palestras").orderByChild(`participantes/${usuarioUid}/usuario_evento`).equalTo(`${usuarioPath}_${eventoPath}`).once("value")
            .then(snaps=>{
                const palestras = [];
                snaps.forEach(snap=>{
                    let palestra = new Palestra().parse(snap.ref.path.toString(),snap.val());
                    if(!palestra.cancelada) palestras.push(palestra);
                });
                resolve(palestras);
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar palestras.", err, {usuarioPath, eventoPath}));
            })
        });
    }
}