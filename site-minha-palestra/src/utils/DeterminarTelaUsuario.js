
/**
 * 
 * @param {import("models-minha-palestra/src/models/Usuario")} usuario
 *  
 */
export default function DeterminarTelaCadastroUsuario(usuario){
    if(!usuario) 
    return undefined;
    else if(!usuario.nome||!usuario.dataNascimento||!usuario.dataNascimento.getTime())
    return "cadastrosobrevoce";
    else if(!usuario.cpf) 
    return "cadastroqueme";
    else 
    return undefined;
}