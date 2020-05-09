const FirestoreObject = require("./FirestoreObject");

module.exports = class Palestra extends FirestoreObject{
    /**
     * Representa uma palestra dentro do sistema.
	 * @param {string} nome Nome da palestra.
	 * @param {string} palestrante Referência ao responsável por ministrar a palestra.
	 * @param {number} descricao Descrição da palestra.
     * @param {string} evento Referencia ao evento da palestra.
	 * @param {number} limiteDeParticipantes sugestão do palestrante para o limite de participantes.
	 * @param {Date} dhApresentacao Data e hora da apresentação.
	 * @param {string} espaco Referência ao espaço em que será realizada a palestra.
	 * @param {Object<string, import("./ParticipanteDePalestra")>} participantes Lista de participantes da palestra.
	 * @param {string} usuarioCriador Referência ao usuário que criou a palestra.
	 * @param {boolean} finalizada Determina se a palestra já está finalizada ou não.
	 * @param {boolean} cancelada Determina se a palestra foi cancelada.
	 * @param {boolean} aprovada Determina se a palestra foi aprovada.
	 * @param {Date} dhCriacao Determina a data e hora de criação da palestra.
	 * @param {Date} dhFinalizacao Determina a data e hora de finalização da palestra.
     */
    constructor(
        path, nome,  palestrante,  descricao, evento, aprovada,
        limiteDeParticipantes, dhApresentacao,  espaco,  participantes,
        usuarioCriador,  finalizada,  cancelada, dhCriacao,  dhFinalizacao, nomePalestrante, fotos
    ){
        super(path);
        this.addRastreio();
        this.nome = nome;
        this.criarAtributoReferencial("palestrante", true);
        this.palestrante = palestrante;
        this.descricao = descricao;
        this.criarAtributoReferencial("evento", true);
        this.evento = evento;
        this.limiteDeParticipantes = limiteDeParticipantes;
        this.dhApresentacao = new Date(dhApresentacao);
        this.criarAtributoReferencial("espaco", true);
        this.espaco = espaco;
        this.participantes = participantes || {};
        this.criarAtributoReferencial("usuarioCriador", true);
        this.usuarioCriador = usuarioCriador;
        this.finalizada = finalizada;
        this.cancelada = cancelada;
        this.aprovada = aprovada;
        this.dhCriacao = new Date(dhCriacao);
        this.dhFinalizacao = new Date(dhFinalizacao);
        this.nomePalestrante = nomePalestrante;
        this.fotos = fotos || [];
        Object.defineProperties(this, {
            "aprovada_finalizada": {
                get:()=>{return `${this.aprovada}_${this.finalizada}`},
                set:()=>{},
                enumerable: true,
            }
        })
    }
}