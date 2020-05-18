import { Permissao } from "models-minha-palestra";
const permissoes = {
    galeria: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "ESPECTADOR", permissao: "r"}, {grupo: "PALESTRANTE", permissao: "r"}),
    perfil: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "ESPECTADOR", permissao: "r"}, {grupo: "PALESTRANTE", permissao: "r"}),
    espaco: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "PALESTRANTE", permissao: "r"}, {grupo: "ESPECTADOR", permissao: "r"}),
    log: new Permissao({grupo: "ADMINISTRADOR", permissao: "r"}),
    evento: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "ESPECTADOR", permissao: "r"}, {grupo: "PALESTRANTE", permissao: "r"}),
    palestra: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "ESPECTADOR", permissao: "r"}, {grupo: "PALESTRANTE", permissao: "r"}),
    selecionar_palestrante: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}),
    selecionar_evento: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "PALESTRANTE", permissao: "w"}),
    selecionar_espaco: new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}, {grupo: "PALESTRANTE", permissao: "w"}),
}
export default permissoes;