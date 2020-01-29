const FirestoreObject = require("./FirestoreObject");

module.exports = class Log extends FirestoreObject{
    /**
     * Representa um log no sistema.
	 * @param {Object<string, boolean>} registros Referência aos registros associados ao log.
	 * @param {string} usuarioAcao Referência ao usuário que realizou a ação descrita no log.
	 * @param {string} tipo Tipo de log.
	 * @param {string} mensagem Mensagem da ação do log.
	 * @param {Date} dh Data em que o log foi registrado.
     */
    constructor(path, registros, usuarioAcao, tipo, mensagem, dh){
        super(path);
        this.registros = registros;
        this.usuarioAcao = usuarioAcao;
        this.tipo = tipo;
        this.mensagem = mensagem;
        this.dh = new Date(dh);
    }
    static TIPOS(){
        return {
            CRIACAO: "CRIACAO",
            ATUALIZACAO: "ATUALIZACAO",
            REMOCAO: "REMOCAO",
        }
    }
}