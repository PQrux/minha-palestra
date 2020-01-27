const FirestoreObject = require("./FirestoreObject");

module.exports = class Limitador extends FirestoreObject{
    /**
     * Representa um limitador de cadastros em palestras no sistema.
	 * @param {Date} inicio Data e hora em que se iniciará o limitador.
	 * @param {Date} termino Data e hora em que o limitador cessará.
	 * @param {number} quantidadeDeInscricoes Quantidade limite de inscrições em palestras para cada usuário.
	 * @param {string} usuarioCriador Referência ao usuário criador do limitador.
	 * @param {Date} dhCriacao Data e hora em que foi criado o limitador.
     */
    constructor(path, inicio, termino, quantidadeDeInscricoes, usuarioCriador, dhCriacao){
        super(path);
        this.inicio = new Date(inicio);
        this.termino = new Date(termino);
        this.quantidadeDeInscricoes = quantidadeDeInscricoes;
        this.usuarioCriador = usuarioCriador;
        this.dhCriacao = new Date(dhCriacao);
    }
}