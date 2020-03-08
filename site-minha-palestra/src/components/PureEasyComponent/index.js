import React, { Component } from 'react';
import { UsuarioHelper } from "../../services";
import { Permissao } from "models-minha-palestra";
/**
 * @typedef EasyComponentProps
 * @property {string|Object} entidade Define a entidade (registro da base de dados) sendo utilizada no momento, pode ser uma string referenciando a entidade ou o objeto já carregado.
 * @property {function()} refreshParent Útil para situações em que existem dentro de um componente EasyComponents que utilizam a mesma entidade.
 * @property {boolean} readOnly Permite apenas a leitura da entidade independente da permissão.
 * @property {boolean} disablePermissao Permite a edição independente da permissão.
 */

 /**
  * @extends {Component<EasyComponentProps>}
  */
export default class PureEasyComponent extends Component {
    /**
     * 
     * @param {any} props 
     * @param {Permissao["prototype"]} permissor 
     */
    constructor(props, permissor){
        super(props);
        this.permissor = permissor;
        this.carregando = true;
        this.erro = undefined;
        this.notFound = false;
        /**@type {import("happytoyou-models/src/models")["UsuarioDoSistema"]["prototype"]} */
        this.usuario = {};
        this.carregar();
    }
    refreshParent(){
        if(this.props.refreshParent) this.props.refreshParent();
    }
    refresh(){
        this.setState({});
    }
    /**
     * Define se a entidade foi ou não encontrada.
     * @param {boolean} valor 
     */
    setCarregando(valor){
        this.carregando = valor;
        this.setState({});
    }
    /**
     * Define se a entidade foi ou não encontrada.
     * @param {boolean} valor 
     */
    setNotFound(valor){
        this.notFound = valor;
        this.setState({});
    }
    /**
     * Define que um erro ocorreu e recebe a descrição desse erro para apresentar ao usuário.
     * @param {string} erro Mensagem de erro.
     */
    setErro(erro){
        this.erro = erro;
        this.setState({});
    }
    /**
     * Essa função é responsável pela renderização do componente quando o usuário
     * possui apenas permissão para leitura das informações.
     * Deve ser sobrescrita para se adequar às especificações da entidade.
     */
    renderRead(){
        return (<div></div>);
    }
    /**
     * Essa função é responsável pela renderização do componente quando o usuário
     * possui permissão para escrita das informações.
     * Deve ser sobrescrita para se adequar às especificações da entidade.
     */
    renderWrite(){
        return (<div></div>);
    }
    /**
     * Essa função é responsável pela renderização do componente quando a informação
     * referenciada na propriedade entidade não existe na base de dados ou não foi preenchida.
     * Deve ser sobrescrita para se adequar às especificações da entidade.
     */
    renderNotFound(){
        return (<div></div>);
    }
    /**
     * Essa função é responsável pela renderização do componente quando o usuário
     * não possui permissões sobre as informações.
     * Deve ser sobrescrita para se adequar às especificações da entidade.
     */
    renderDeny(){
        return (<div></div>);
    }
    /**
     * Essa função é responsável pela renderização do componente quando o usuário
     * não possui permissões sobre as informações.
     * Deve ser sobrescrita para se adequar às especificações da entidade.
     */
    renderError(){
        return (<div></div>);
    }
    /**
     * Essa função é responsável pela renderização do componente quando as informações ainda estão sendo carregadas.
     * Deve ser sobrescrita para se adequar às especificações da entidade.
     */
    renderLoading(){
        return (<div></div>)
    }
    /**
     * Uma callback que é disparada quando o usuário é carregado pelo componente.
     * Pode ser sobrescrita para ações adicionadas serem realizadas após o carregamento do usuário,
     * antes do carregamento das informações da entidade.
     * @param {import("happytoyou-models/src/models")["UsuarioDoSistema"]["prototype"]} usuario 
     */
    onUsuario(usuario){

    }
    /**
     * Realiza a captura da entidade e finaliza o carregamento do componente.
     * Deve ser sobrescrita para se adequar às especificações da entidade.
     */
    carregarEntidade(){
        this.setCarregando(false);
    }
    componentDidUpdate(prevProps){
        if(this.props.entidade !== prevProps.entidade){
            this.carregarEntidade();
        }
    }
    /**
     * Faz o carregamento das informações do usuário e dados. Não deve ser sobrescrita.
     * @private
     */
    carregar(){
        UsuarioHelper.getUsuarioAtual().then(usuario=>{
            this.usuario = usuario;
            this.onUsuario(usuario);
            this.carregarEntidade();
        })
        .catch((err)=>{
            if(err.codigo === -2 && this.anonymousAllowed)
            this.carregarEntidade();
            else
            this.setErro(err.descricao);
        });
    }
    render(){
        if(this.erro)
        return this.renderError();
        else if(this.notFound)
        return this.renderNotFound();
        else if(this.carregando)
        return this.renderLoading();
        if(this.props.disablePermissao||this.disablePermissao)
        return this.renderWrite();
        else{
            if(this.permissor.permitir(this.usuario) === "r"||this.props.readOnly)
            return this.renderRead();
            else if (this.permissor.permitir(this.usuario) === "w")
            return this.renderWrite();
            else 
            return this.renderDeny();
        }
    }
}
