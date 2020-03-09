const FirestoreObject = require("./FirestoreObject");

module.exports = class Palestra extends FirestoreObject{
    /**
     * Representa uma palestra dentro do sistema.
	 * @param {string} nome Nome da palestra.
	 * @param {string} palestrante Referência ao responsável por ministrar a palestra.
	 * @param {number} duracao Duração aproximada da palestra em minutos.
	 * @param {number} descricao Descrição da palestra.
	 * @param {Array<string>} fotos Caminho para as fotos da palestra.
	 * @param {number} limiteDeParticipantes Limite máximo de participantes da palestra.
	 * @param {number} sugeridoLimiteDeParticipantes sugestão do palestrante para o limite de participantes.
	 * @param {Date} dhApresentacao Data e hora da apresentação.
	 * @param {Date} sugeridoDhApresentacao sugestão do palestrante para data e hora da apresentação.
	 * @param {string} espaco Referência ao espaço em que será realizada a palestra.
	 * @param {Array<import("./ParticipanteDePalestra")>} participantes Lista de participantes da palestra.
	 * @param {string} usuarioCriador Referência ao usuário que criou a palestra.
	 * @param {string} usuarioAprovacao Referência ao usuário administrador que aprovou a palestra.
	 * @param {boolean} finalizada Determina se a palestra já está finalizada ou não.
	 * @param {boolean} cancelada Determina se a palestra foi cancelada.
	 * @param {boolean} aprovada Determina se a palestra foi aprovada.
	 * @param {Date} dhCriacao Determina a data e hora de criação da palestra.
	 * @param {Date} dhFinalizacao Determina a data e hora de finalização da palestra.
	 * @param {Date} dhAprovacao Determina a data e hora de aprovação da palestra.
     */
    constructor(
        path, nome,  palestrante,  duracao,  descricao,  fotos,
        limiteDeParticipantes,  sugeridoLimiteDeParticipantes,
        dhApresentacao,  sugeridoDhApresentacao,  espaco,  participantes,
        usuarioCriador,  usuarioAprovacao,  finalizada,  cancelada,
        aprovada,  dhCriacao,  dhFinalizacao,  dhAprovacao, nomePalestrante
    ){
        super(path);
        this.nome = nome;
        this.criarAtributoReferencial("palestrante", true);
        this.palestrante = palestrante;
        this.duracao = duracao;
        this.descricao = descricao;
        this.fotos = fotos;
        this.limiteDeParticipantes = limiteDeParticipantes;
        this.sugeridoLimiteDeParticipantes = sugeridoLimiteDeParticipantes;
        this.dhApresentacao = new Date(dhApresentacao);
        this.sugeridoDhApresentacao = new Date(sugeridoDhApresentacao);
        this.criarAtributoReferencial("espaco", true);
        this.espaco = espaco;
        this.participantes = participantes;
        this.usuarioCriador = usuarioCriador;
        this.criarAtributoReferencial("usuarioAprovacao", true);
        this.usuarioAprovacao = usuarioAprovacao;
        this.finalizada = finalizada;
        this.cancelada = cancelada;
        this.aprovada = aprovada;
        Object.defineProperty(this, "_aprovada_finalizada", {
            enumerable: true,
            set: () => {},
            get: () => {
                return !!(this.aprovada)+"_"+!!(this.finalizada);
            }
        })
        Object.defineProperty(this, "_aprovada_cancelada", {
            enumerable: true,
            set: () => {},
            get: () => {
                return !!(this.aprovada)+"_"+!!(this.cancelada);
            }
        })
        this.dhCriacao = new Date(dhCriacao);
        this.dhFinalizacao = new Date(dhFinalizacao);
        this.dhAprovacao = new Date(dhAprovacao);
        this.nomePalestrante = nomePalestrante;
    }
}