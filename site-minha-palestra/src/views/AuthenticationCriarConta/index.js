import React from 'react';
import { Box, Button, Typography, Link } from '@material-ui/core';
import { MaskedTextField, EasyComponent } from '../../components';
import { UsuarioHelper, DialogHelper } from '../../services';
export default class AuthenticationCriarConta extends EasyComponent {
    constructor(props){
        super(props, undefined, undefined, undefined, undefined, {flex: 1});
        this.state = {
            email: "",
            senha: "",
        }
    }
    disablePermissao = true;
    anonymousAllowed = true;
    registrar = () => {
        this.setCarregando(true);
        UsuarioHelper.registrarEmail(this.state.email, this.state.senha)
        .then(usuario=>{
            this.setCarregando(false);
            this.props.history.push("cadastrosobrevoce");
        })
        .catch(err=>{
            this.setCarregando(false);
            this.setErro(err.descricao);
        })
    }
    change = ({target}) =>{
        this.setState({[target.name]: target.value});
    }
    politica = () => {
        DialogHelper.showDialog("Política de Privacidade", <Typography align="justify">{pol}</Typography>, DialogHelper.okButton);
    }
    renderWrite() {
        return (
                <form className="DefaultPages_ROOT" onSubmit={this.registrar}>
                    <Typography align="center">Para começar, nos informe seu e-mail e uma senha:</Typography>
                    <MaskedTextField
                        onChange={this.change}
                        label="E-mail" variant="outlined"
                        inputMode="email"
                        className="DefaultPages_INPUTS"
                        value={this.state.email} name="email"
                    />
                    <MaskedTextField
                        onChange={this.change}
                        type="password"
                        label="Senha" variant="outlined"
                        className="DefaultPages_INPUTS"
                        value={this.state.senha} name="senha"
                    />
                    <Typography variant="caption">Clicando em PROSSEGUIR você concorda com os termos da <Link onClick={this.politica}>POLÍTICA DE PRIVACIDADE.</Link></Typography>
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" type="submit">
                        PROSSEGUIR
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
                    </Button>
                </form>
        );
    }
    resetError = () => {
        this.setErro(undefined);
    }
    renderError(){
        return (
            <Box className="DefaultPages_ROOT">
                {super.renderError()}
                <Button onClick={this.resetError} color="primary" variant="outlined">
                    Tentar Novamente
                </Button>
            </Box>
        )
    }
}
const pol=`
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet dui ac ex posuere euismod. In tempor consectetur libero pellentesque placerat. Phasellus porta neque vel lacus aliquet dapibus. Donec sed metus fringilla, feugiat velit vitae, blandit lectus. Proin mollis, ligula eget tempor faucibus, enim nisi imperdiet nulla, sed ultrices velit arcu ut massa. Nam elementum nec enim non tincidunt. Duis maximus condimentum dui, vel aliquam ex aliquet et. Aliquam gravida dui sit amet magna consectetur tristique. Mauris ultricies velit tincidunt elementum tempus. Nulla fringilla ipsum in erat varius, eget cursus elit pulvinar.

Donec nisi tortor, volutpat sit amet sodales sit amet, sagittis sed justo. Nulla eget libero eu augue volutpat interdum. Sed iaculis tincidunt nisi eu rhoncus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque volutpat, velit quis rutrum fringilla, lectus massa venenatis arcu, non consectetur elit nisl ac enim. Cras ut lectus est. Vestibulum venenatis elit at dui mollis ultrices. Aliquam eu felis lectus. Mauris vitae odio at nibh accumsan lacinia. Proin metus neque, varius eget tempus ut, sodales maximus massa.

Cras sapien ligula, interdum ac scelerisque non, pharetra ac ipsum. Curabitur ullamcorper scelerisque cursus. Aenean finibus ante viverra, ornare dolor a, pretium nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam libero leo, venenatis vel lorem non, iaculis pretium eros. Vestibulum et leo ipsum. Mauris id egestas ipsum. Phasellus et enim non urna feugiat tincidunt eu sit amet purus. Maecenas dictum, leo non porta volutpat, magna felis tristique nisl, imperdiet porta libero augue ac magna. Sed venenatis in urna in rutrum. Donec orci dui, consectetur et venenatis eget, faucibus a ex. In varius massa quis diam aliquam, nec commodo dui pulvinar. Cras malesuada placerat faucibus. Aliquam sem dui, elementum eget augue volutpat, scelerisque finibus libero. Pellentesque ac blandit leo. Vivamus pellentesque sit amet eros sit amet aliquam.

Cras vitae augue dignissim, placerat augue sit amet, tempus felis. In convallis ac purus non laoreet. Vestibulum a vestibulum diam. Nunc nec libero at dui tristique scelerisque. Mauris vestibulum sapien nulla, quis semper sapien imperdiet vitae. Donec ut ante nec elit ullamcorper molestie. Phasellus efficitur lectus erat, vel vulputate justo commodo a. Etiam justo metus, pharetra ac malesuada eget, porttitor at massa. Proin a ligula eu ante tristique tempus sit amet quis ex. Pellentesque in commodo turpis, id vulputate ipsum. Nullam lacinia cursus ante, eget accumsan nisi. Cras aliquam arcu vel suscipit feugiat. Vivamus elementum sem bibendum, posuere erat a, scelerisque orci. Nullam tincidunt venenatis tortor non tincidunt. Donec vulputate tincidunt ligula, rhoncus vestibulum ipsum fermentum at.

Phasellus ac sollicitudin nisi. Phasellus feugiat sapien ut nunc egestas, ac semper magna commodo. Quisque vel neque nibh. Donec sed risus in elit gravida vehicula. Sed sapien ligula, dapibus id vulputate aliquet, pharetra sit amet sem. Aenean maximus auctor lacus at scelerisque. Vivamus facilisis auctor odio, eu pretium tellus vulputate in. Vivamus vitae efficitur metus, tempus pharetra elit. Morbi congue eros in suscipit ornare. Vivamus vestibulum lorem feugiat consequat maximus. Curabitur mollis faucibus velit nec scelerisque. Sed laoreet mi vel congue venenatis. Cras eget accumsan nibh, ac ornare mi.

Phasellus viverra sapien at diam venenatis bibendum. Aliquam erat volutpat. Etiam nec ultrices lectus, ac vehicula arcu. Fusce et condimentum neque. Proin non mauris blandit, fermentum ipsum non, pulvinar mi. Aliquam mi sapien, auctor quis odio eu, porttitor finibus leo. Vestibulum et semper ipsum, id sollicitudin libero. Fusce nec placerat libero, sed aliquet diam. In et est diam. Etiam id lacus quis nibh lobortis malesuada. Nam et faucibus nisl. In hac habitasse platea dictumst.

Etiam porta vel augue ac malesuada. Aenean nec ligula in sem interdum hendrerit eu ultrices dolor. Morbi vel justo a lacus placerat lacinia nec eget massa. In consectetur elit a ipsum faucibus, a ornare dui tristique. Morbi porttitor luctus augue, in sodales diam dapibus in. Proin eu mauris id mi vulputate maximus. Proin consequat sapien id mi finibus, vel malesuada nisl cursus. Curabitur suscipit condimentum pharetra. In fringilla hendrerit libero vel blandit. Proin magna nisi, euismod in condimentum eget, molestie laoreet ex.

Nulla quis ligula quam. Aliquam erat volutpat. Phasellus ac arcu sed metus rutrum dignissim. Mauris congue tellus urna, ac sodales turpis viverra vitae. Praesent fermentum placerat eros vitae fringilla. Phasellus pharetra odio a dui fermentum ullamcorper. Praesent lobortis leo maximus sem pulvinar, in rhoncus enim posuere. Etiam sed pretium sapien, non pharetra ante. Praesent consectetur quam turpis, vel rhoncus tortor lacinia a. Morbi aliquam, nibh ut malesuada iaculis, lectus velit placerat sapien, eu dapibus justo eros ac enim. Ut ex mi, semper laoreet semper at, dignissim eget risus.

Integer mauris eros, lacinia nec dolor eu, posuere convallis mi. Mauris commodo diam urna, vehicula cursus libero pellentesque sit amet. Aliquam pretium neque et purus sollicitudin, bibendum tincidunt massa accumsan. Mauris odio dolor, euismod at convallis vel, iaculis in ligula. Cras convallis elit vel augue ultricies blandit. Quisque porta tellus sed nisl hendrerit feugiat. Phasellus lobortis quis diam non elementum. Etiam sodales, magna id pharetra ultricies, elit nisi venenatis sem, at venenatis leo tortor id elit. Pellentesque pharetra est felis, non facilisis lacus condimentum eu. Vivamus imperdiet nunc quis massa congue hendrerit. Curabitur in enim vitae diam blandit consequat sed ut nulla. Quisque sapien velit, pharetra sit amet congue sit amet, gravida nec libero. Sed nec ultricies augue, vitae elementum nibh. Mauris in dignissim orci, vitae porta sem. Etiam id hendrerit justo.

Maecenas id placerat mauris, quis consectetur sapien. Vivamus sem metus, porta vel convallis eget, accumsan eu enim. Nunc at erat condimentum, hendrerit libero placerat, volutpat ipsum. Praesent semper nibh at pharetra consectetur. Mauris dictum nisi leo, in blandit mauris congue eget. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris maximus, enim a hendrerit mattis, arcu urna suscipit arcu, quis fermentum sapien elit ac enim. Sed pellentesque tellus velit, ac mattis dui dignissim ut. Curabitur vitae bibendum ligula. Donec interdum ex sit amet tempor dignissim. Donec ut eleifend metus. Mauris varius enim vel diam aliquam fermentum. Maecenas vitae iaculis odio. Phasellus tempor, purus in lacinia elementum, nibh ligula ultricies odio, et dignissim purus risus vitae odio.
`