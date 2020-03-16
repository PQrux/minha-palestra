const FirestoreObject = require("./FirestoreObject");

module.exports = class Espaco extends FirestoreObject{
    /**
     * Representa um espaço no sistema.
	 * @param {string} nome Nome do espaço.
	 * @param {string} descricao Descrição do espaço.
	 * @param {string} limiteDePessoas Limite máximo de pessoas que o espaço permite.
     * @param {string} 
	 * @param {"pequeno"|"medio"|"grande"} tamanho Tamanho do espaço.
	 * @param {string} usuarioCriador Usuário criador do espaço.
	 * @param {Date} dhCriacao Data e hora em que foi criado o espaço.
	 * @param {boolean} habilitado Determina se o espaço está habilitado ou não.
	 * @param {string} palestraEmUso Referência à palestra utilizando o espaço no momento.
     */
    constructor(
        path, nome,  descricao,  limiteDePessoas,  tamanho, tipo, habilitado,
        usuarioCriador,  dhCriacao,  palestraEmUso
    ){
        super(path);
        this.addRastreio();
        this.nome = nome;
        this.descricao = descricao;
        this.limiteDePessoas = limiteDePessoas;
        this.tamanho = tamanho;
        this.usuarioCriador = usuarioCriador;
        this.dhCriacao = new Date(dhCriacao);
        this.habilitado = habilitado === false ? false : true;
        this.palestraEmUso = palestraEmUso;
        this.tipo = tipo;
    }
    static tamanhos(){
        return {
            "PEQUENO": "PEQUENO",
            "MÉDIO": "MÉDIO",
            "GRANDE": "GRANDE",
        }
    }
    static tipos(){
        return {
            "SALA": "SALA",
            "AUDITÓRIO": "AUDITÓRIO",
            "LABOTARÓRIO DE INFORMÁTICA": "LABOTARÓRIO DE INFORMÁTICA",
            "EXTERIOR": "EXTERIOR",
            "OUTRO": "OUTRO",
        }
    }

}