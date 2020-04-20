import { Permissao } from "models-minha-palestra";
const permissoes = {
    galeria: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "USUARIO", permissao: "r"}, {grupo: "PALESTRANTE", permissao: "r"}),
    perfil: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "USUARIO", permissao: "r"}, {grupo: "PALESTRANTE", permissao: "r"}),
    espaco: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "PALESTRANTE", permissao: "r"}, {grupo: "USUARIO", permissao: "r"}),
    log: new Permissao({grupo: "ADMINISTRADOR", permissao: "r"}),
    evento: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "USUARIO", permissao: "r"}, {grupo: "PALESTRANTE", permissao: "r"}),
    palestra: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "USUARIO", permissao: "r"}, {grupo: "PALESTRANTE", permissao: "r"}),
}
export default permissoes;