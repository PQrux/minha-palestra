module.exports = class ParticipanteDePalestra {
    /**
     * Representa a participação de um usuário em uma palestra.
	 * @param {string} usuario Referência ao usuário.
	 * @param {string} nome Nome do usuário.
	 * @param {string} cpf Registro academico do usuário.
	 * @param {boolean} compareceu Define se o usuário compareceu ou não na palestra.
     */
    constructor(usuario, nome, cpf, compareceu){
        this.usuario = usuario;
        this.nome = nome;
        this.cpf = cpf;
        this.compareceu = compareceu;
    }
}