module.exports = class Resultado{
    /**
     * Utilizada para informar sucesso ou problemas ao realizar atividades dentro do sistema.
     * @param {number} codigo Código da atividade.
     * @param {String} descricao Define a descrição da atividade.
     * @param {any} stackTrace Informações adicionais sobre o erro.
     * @param {any} dados Caso haja algum dado à ser retornado em operações bem sucedidas.
     */
    constructor(codigo, descricao, stackTrace,dados){
        this.codigo = codigo;
        this.descricao = descricao;
        Object.defineProperty(this, "stackTrace",{
            get: function(){
                return this._stackTrace;
            },
            set: function(value) {
                this._stackTrace = value;
            }
        });
        this.stackTrace = stackTrace;
        this.dados = dados;
    }    
}