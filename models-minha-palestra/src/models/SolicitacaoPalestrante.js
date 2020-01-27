const FirestoreObject = require("./FirestoreObject");

module.exports = class SolicitacaoPalestrante extends FirestoreObject{
    /**
     * Representa uma solicitação de um usuário para se tornar palestrante.
     * @param {string} usuario Referência ao usuário.
     * @param {string} apelo Apelo escrito pelo usuário.
     * @param {Date} dhSolicitacao Data em que foi feita a solicitação.
     */
    constructor(path, usuario, apelo, dhSolicitacao){
        super(path);
        this.usuario = usuario;
        this.apelo = apelo;
        this.dhSolicitacao = new Date(dhSolicitacao);
    }
}