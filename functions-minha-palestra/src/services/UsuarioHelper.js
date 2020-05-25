const { Usuario, Resultado } = require("models-minha-palestra");
const firebase = require("firebase-admin");

module.exports = class UsuarioHelper{
    /**
     * 
     * @param {string} token 
     * @returns {Promise.<Usuario>}
     */
    static getUserByToken(token){
        return new Promise(async (resolve,reject)=>{
            try{
                firebase.auth().verifyIdToken(token).then((decoded)=>{
                    UsuarioHelper.getUserById(decoded.uid).then(usuario=>{
                        resolve(usuario);
                    })
                    .catch(err=>{
                        reject(err);
                    })
                })
                .catch(err=>{
                    reject(new Resultado(-1,"Token inválido.", err, {token}));
                })
            }
            catch(err){
                reject(new Resultado(-1,"Token inválido.", err, {token}));
            }
        });
    }
    /**
     * 
     * @param {string} id 
     * @returns {Promise.<Usuario>}
     */
    static getUserById(id){
        return new Promise(async (resolve,reject)=>{
            firebase.database().ref("Usuarios").child(id).once("value")
            .then(snap=>{
                if(!snap.exists()){
                    resolve(new Resultado(-1, "Usuário inexistente.",null,{id}));
                    return;
                }
                let usuario = new Usuario().parse(`Usuarios/${id}`, snap.val());
                resolve(usuario);
            })
            .catch(err=>{
                resolve(new Resultado(-1, "Erro ao buscar usuário.",err,{id}));
            })
        });
    }
}