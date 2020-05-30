import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import { multiStorager, TraduzirErroAuth } from "../utils";
import { Usuario, Resultado, Log } from "models-minha-palestra";
import LogHelper from "./LogHelper";

export default class UsuarioHelper{
    /**
     * Prepara um usuário, seja ele novo ou já existente na base, não chame esse método em interfaces! ele deve ser usado apenas para auxiliar os métodos de login.
     * @param {{uid: string}} user Objeto de usuário retornado pelo firebase.
     * @returns {Promise.<Usuario["prototype"]>}
     */
    static prepararUsuarioByUser(user){
        return new Promise(async (resolve,reject)=>{
            if(!user||!user.uid){
                reject(new Resultado(-1, "Usuário inválido.", null, {user}));
            }
            else{
                firebase.database().ref("Usuarios").child(user.uid).once("value").then(snap=>{
                    if(snap.exists()){
                        let usuario = new Usuario().parse(snap.ref.path.toString(), snap.val());
                        multiStorager.DataStorager.set("usuario", usuario);
                        resolve(usuario);
                    }
                    else{
                        let novoUsuario = new Usuario();
                        novoUsuario.path = snap.ref.path.toString();
                        novoUsuario.email = user.email;
                        novoUsuario.nome = user.displayName;
                        novoUsuario.fotoPerfil = user.photoURL;
                        novoUsuario.dhCriacao = new Date();
                        novoUsuario.grupo = Usuario.GRUPOS().ESPECTADOR;
                        snap.ref.set(novoUsuario.toJson()).then(()=>{
                            resolve(novoUsuario);
                        })
                        .catch(err=>{
                            reject(new Resultado(-1,"Erro ao criar registro de usuário.", err, {user}));
                        })
                    }
                })
                .catch(err=>{
                    UsuarioHelper.desconectar();
                    reject(new Resultado(-1,"Erro ao buscar informações na base de dados. Desconectando.", err, {user}));
                }) 
            }
        });
    }
    /**
     * Retorna o usuário conectado no site.
     * @returns {Promise.<Usuario["prototype"]>}
     */
    static getUsuarioAtual(){
        return new Promise(async (resolve,reject)=>{
            let cache = multiStorager.DataStorager.get("usuario");
            if(cache && cache instanceof Usuario){
                resolve(cache);
            }
            else{
                let receberUsuario = (user) =>{
                    UsuarioHelper.prepararUsuarioByUser(user).then(usuario=>{
                        multiStorager.DataStorager.set("usuario", usuario);
                        resolve(usuario);
                    })
                    .catch(err=>{
                        reject(err);
                    })
                }
                if(firebase.auth().currentUser){
                    receberUsuario(firebase.auth().currentUser);
                }
                else{
                    let unsubs = firebase.auth().onAuthStateChanged((user)=>{
                        unsubs();
                        if(user){
                            receberUsuario(user);
                        }
                        else{
                            reject(new Resultado(-2, "O usuário não está conectado!",null,null));
                        }
                    });
                }   
            }
        });
    }
    /**
     * Realiza login através de e-mail e senha.
     * @param {string} email E-mail do usuário.
     * @param {string} senha Senha do usuário.
     * @returns {Promise.<Usuario["prototype"]>}
     */
    static loginEmail(email, senha){
        return new Promise(async (resolve,reject)=>{
            firebase.auth().signInWithEmailAndPassword(email, senha).then(credential=>{
                UsuarioHelper.prepararUsuarioByUser(credential.user).then(usuario=>{
                    resolve(usuario);
                })
                .catch(err=>{
                    reject(err);
                })
            })
            .catch(err=>{
                reject(new Resultado(-1, TraduzirErroAuth(err), err, {email, senha}));
            })
        });
    }
    /**
     * Registra um novo usuário através de e-mail e senha.
     * @param {string} email E-mail do usuário.
     * @param {string} senha Senha do usuário.
     * @returns {Promise.<Usuario["prototype"]>}
     */
    static registrarEmail(email, senha){
        return new Promise(async (resolve,reject)=>{
            firebase.auth().createUserWithEmailAndPassword(email, senha).then(credential=>{
                UsuarioHelper.prepararUsuarioByUser(credential.user).then(usuario=>{
                    resolve(usuario);
                })
                .catch(err=>{
                    reject(err);
                })
            })
            .catch(err=>{
                reject(new Resultado(-1, TraduzirErroAuth(err), err, {email, senha}));
            })
        });
    }
    /**
     * Realiza login através de um provedor externo.
     * @param {import("firebase")["auth"]["OAuthProvider"]} provedor
     * @returns {Promise.<Usuario["prototype"]>}
     */
    static loginProvedorExterno(provedor){
        return new Promise(async (resolve,reject)=>{
            firebase.auth().signInWithPopup(provedor).then(credential=>{
                UsuarioHelper.prepararUsuarioByUser(credential.user).then(usuario=>{
                    resolve(usuario);
                })
                .catch(err=>{
                    reject(err);
                })
            })
            .catch(err=>{
                reject(new Resultado(-1, TraduzirErroAuth(err), err, {provedor}));
            })
        });
    }
    static PROVEDORES_EXTERNOS(){
        return {
            google: firebase.auth.GoogleAuthProvider,
            facebook: firebase.auth.FacebookAuthProvider,
        }
    }
    /**
     * 
     * @param {Usuario["prototype"]} usuario 
     * @returns {Promise.<Usuario["prototype"]>}
     */
    static atualizarUsuario(usuario){
        return new Promise(async (resolve,reject)=>{
            let ok = true;
            if(!((usuario instanceof Usuario) && usuario.path)){
                reject(new Resultado(-1, "Usuário inválido.", null, {usuario}));
                return;
            }
            let usuarioAtual = await UsuarioHelper.getUsuarioAtual()
            .catch(err=>{
                reject(err);
                ok = false;
            })
            if(!ok) return;
            if((usuario.path !== usuarioAtual.path) && (usuarioAtual.grupo !== Usuario.GRUPOS().ADMINISTRADOR)){
                reject(new Resultado(-1, "Você não tem permissão para executar esta ação.", null, {usuario}));
                return;
            }
            LogHelper.logarECommitar([usuario.path], Log.TIPOS().ATUALIZACAO,undefined, usuario)
            .then((usuarioAtualizado)=>{
                if(usuarioAtualizado.path === usuarioAtual.path){
                    multiStorager.DataStorager.set("usuario",usuarioAtualizado);
                }
                resolve(usuarioAtualizado);
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao atualizar usuário.",err, {usuario}));
            })
        });
    }
    /**
     * Desconecta um usuário do sistema.
     */
    static desconectar(){
        return new Promise(async (resolve,reject)=>{
            await firebase.auth().signOut()
            .catch(console.log);
            multiStorager.DataStorager.delete("usuario");
            resolve();
        });
    }
    /**
     * Envia um e-mail de recuperação de senha para o endereço informado.
     * @param {string} email E-mail para o qual se deseja recuperar a senha.
     */
    static enviarEmailDeRecuperacaoDeSenha(email){
        return new Promise(async (resolve,reject)=>{
            firebase.auth().sendPasswordResetEmail(email).then(()=>{
                resolve();
            })
            .catch(err=>{
                reject(new Resultado(-1, TraduzirErroAuth(err), err, {email}));
            })
        });
    }
    /**
     * @returns {Promise.<Array<Usuario["prototype"]>>}
     */
    static listarUsuarios(tipoFiltro, filtro, mode){
        return new Promise(async (resolve,reject)=>{
            let ref = firebase.database().ref("Usuarios");
            if(tipoFiltro && tipoFiltro !== undefined) ref = ref.orderByChild(tipoFiltro)[mode||"equalTo"](filtro);
            ref.once("value").then(snaps=>{
                let usuarios = [];
                snaps.forEach(snap=>{
                    usuarios.push(new Usuario().parse(snap.ref.path.toString(), snap.val()));
                })
                resolve(usuarios);
            })
            .catch(err=>{
                reject(new Resultado(-1, "Erro ao buscar usuários.", err));
            })
        });
    }
    /**
     * 
     * @param {string} path 
     * @returns {Promise.<Usuario["prototype"]>}
     */
    static buscar(path){
        return new Promise(async (resolve,reject)=>{
            if(!path){
                reject(new Resultado(-1, "Usuário indefinido!", null, {path}));
            }
            firebase.database().ref(path).once("value")
            .then(snap=>{
                if(!snap.exists()) reject(new Resultado(-2, "Usuário não encontrado!", null, {path}));
                else resolve(new Usuario().parse(snap.ref.path.toString(), snap.val()));
            })
            .catch(err=>{
                reject(new Resultado(-2, "Erro ao buscar usuário!", err, {path}));
            })
        });
    }
}