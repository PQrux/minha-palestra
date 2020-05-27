const FirestoreObject = require("./FirestoreObject");

module.exports = class Usuario extends FirestoreObject{
    /**
     * Representa um usuário dentro do sistema.
	 * @param {string} grupo Grupo a qual o usuário pertence. Define os direitos do mesmo no sistema.
	 * @param {string} email E-mail do usuário.
	 * @param {string} nome Nome completo do usuário.
	 * @param {string} cpf CPF do usuário.
	 * @param {string} registroAcademico Registro Academico do usuário.
	 * @param {string} fotoPerfil Caminho para a foto de perfil do usuário.
	 * @param {string} sobre Descrição sobre si, feita pelo próprio usuário.
	 * @param {Date} dataNascimento Data de nascimento do usuário.
	 * @param {Date} dhRegistro Data em que o usuário foi registrado.
	 * @param {Array<string>} palestras Referências às palestras que o usuário já participou.
	 * @param {Array<string>} minhasPalestras Referências às palestras que o usuário já deu.
	 * @param {Date} aprovadoComoPalestrante Define quando o usuário foi aprovado como palestrante.
	 * @param {Date} aprovadoComoAdministrador Define quando o usuário foi aprovado como administrador.
     */
    constructor(
        path, grupo, email, nome, cpf, registroAcademico,
        fotoPerfil, sobre, dataNascimento, dhCriacao, palestras,
        minhasPalestras, aprovadoComoPalestrante, aprovadoComoAdministrador, usuarioCriador, permissoes
    ){
        super(path);
        this.addRastreio();
        this.grupo = grupo;
        this.email = email;
        this.nome = nome;
        this.cpf = cpf;
        this.registroAcademico = registroAcademico;
        this.fotoPerfil = fotoPerfil;
        this.sobre = sobre;
        this.dataNascimento = new Date(dataNascimento);
        this.dhCriacao = new Date(dhCriacao);
        this.palestras = palestras;
        this.minhasPalestras = minhasPalestras;
        this.aprovadoComoPalestrante = new Date(aprovadoComoPalestrante);
        this.aprovadoComoAdministrador = new Date(aprovadoComoAdministrador);
        this.usuarioCriador = usuarioCriador;
        this.permissoes = permissoes||{};
    }
    static GRUPOS(){
        return {
            ADMINISTRADOR: "ADMINISTRADOR",
            PALESTRANTE: "PALESTRANTE",
            ESPECTADOR: "ESPECTADOR",
        }
    }
}