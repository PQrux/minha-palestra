const FirestoreObject = require("./FirestoreObject");

module.exports = class ParticipanteDePalestra extends FirestoreObject {
    /**
     * Representa a participação de um usuário em uma palestra.
	 * @param {string} usuario Referência ao usuário.
	 * @param {string} nome Nome do usuário.
	 * @param {string} cpf Registro academico do usuário.
	 * @param {boolean} compareceu Define se o usuário compareceu ou não na palestra.
     */
    constructor(usuario, nome, cpf, compareceu, usuario_evento){
        super();
        this.usuario = usuario;
        this.nome = nome;
        this.cpf = cpf;
        this.compareceu = compareceu ? true : false;
        this.inscrito = true;
        this.usuario_evento = usuario_evento;
        this.inscrito_compareceu = `${this.inscrito}_${this.compareceu}`;
    }
}