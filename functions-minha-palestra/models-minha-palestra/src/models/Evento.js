const FirestoreObject = require("./FirestoreObject");

module.exports = class Evento extends FirestoreObject{
    /**
     * Representa um evento no sistema.
     * @param {String} path Caminho de acesso no firestore para o objeto.
     * @param {string} nome Nome do evento.
     * @param {string} descricao descrição do evento.
     * @param {Date} inicio Data de início do evento.
     * @param {Date} termino Data de termino do evento.
     * @param {number} limiteInscricoes Limite de palestras em que um usuário pode se inscrever em um evento.
     * @param {string} usuarioCriador Referência ao usuário criador do evento.
     * @param {Date} dhCriacao Data de criação do evento.
     * @param {Array<string>} palestras Referências às palestras vinculadas ao evento.
     */
    constructor(
        path, nome, descricao, inicio, termino, limiteInscricoes, usuarioCriador, dhCriacao, palestras
    ){
        super(path);
        this.addRastreio();
        this.nome = nome;
        this.descricao = descricao;
        this.inicio = new Date(inicio);
        this.termino = new Date(termino);
        this.limiteInscricoes = limiteInscricoes;
        this.usuarioCriador = usuarioCriador;
        this.dhCriacao = new Date(dhCriacao);
        this.palestras = palestras||[];
    }
}