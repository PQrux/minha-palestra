
module.exports = class Permissao{
    /**
     * @param {...{grupo: "ADMINISTRADOR"|"PALESTRANTE"|"USUARIO", permissao: "w"|"r"}} perms
     */
    constructor(...perms){
        /**@type {Object<string, "w"|"r">} */
        this.perms = {};
        perms.forEach(perm=>{
            this.perms[perm.grupo] = perm.permissao;
        })
    }
    grupos(){
        return {
            ADMINISTRADOR: "ADMINISTRADOR",
            PALESTRANTE: "PALESTRANTE",
            USUARIO: "USUARIO",
        }
    }
    /**
     * 
     * @param {import("./Usuario")} usuario 
     */
    permitir(usuario){
        return this.perms[usuario.grupo];
    }
}