import EasyComponent from '../EasyComponent';

export default class SelectibleList extends EasyComponent {
    /**
     * Define o item selecionado da lista e retorna para o componente pai.
     */
    setSelecionado = (selecionado) => {
        if(this.props.onSelecionado) this.props.onSelecionado(selecionado);
        this.setState({selecionado});
    }
}
