export default function TraduzirErroAuth(stacktrace){
    if(stacktrace.code && lista[stacktrace.code]){
        return lista[stacktrace.code];
    }
    else{
        return "Erro desconhecido, por favor tente novamente.";
    }
}

const lista = {
    "auth/app-not-authorized": "Aplicativo desautorizado, por favor, contate o administrador.",
    "auth/cors-unsupported": "O navegador não é suportado. Por favor, atualize-o ou instale um novo navegador.",
    "auth/credential-already-in-use": "As credenciais informadas já estão em uso.",
    "auth/email-already-in-use": "O e-mail informado já está sendo utilizado por outra conta.",
    "auth/invalid-user-token": "O token expirou, por favor, conecte-se novamente.",
    "auth/invalid-email": "O endereço de e-mail informado é inválido.",
    "auth/wrong-password": "E-mail ou senha inválidos.",
    "auth/app-deleted": "Aplicativo desautorizado, por favor, contate o administrador.",
    "auth/account-exists-with-different-credential": "O e-mail informado já está sendo utilizado por outra conta.",
    "auth/network-request-failed": "Erro de conexão. Por favor, verifique sua conexão com a internet e tente novamente.",
    "auth/popup-blocked": "Popup bloqueado, por favor, habilite os popups para esta página e tente novamente.",
    "auth/timeout": "A conexão expirou. Recarregue a página e tente novamente.",
    "auth/user-token-expired": "O token expirou, por favor, conecte-se novamente.",
    "auth/too-many-requests": "Seu dispositivo foi bloqueado por exceder o número máximo de tentativas de login, por favor, tente novamente mais tarde.",
    "auth/user-cancelled": "Você precisa aceitar todas as permissões solicitadas para continuar.",
    "auth/user-not-found": "E-mail ou senha inválidos.",
    "auth/user-disabled": "Conta encerrada.",
    "auth/weak-password": "Senha muito fraca. Por favor, insira uma senha com 6 caracteres ou mais.",
    "auth/web-storage-unsupported": "O navegador não é suportado. Por favor, atualize-o ou instale um novo navegador."
};
