const { Requester, DateUtils, GeradorPDF } = require("../../Utils");
const { UsuarioHelper, PalestraHelper } = require("../../services");
const { Resultado } = require("models-minha-palestra");
const QRCode = require('qrcode');
const secret = require("../../../secret");

/**@returns {Promise<[import("models-minha-palestra/src/models/Usuario"), import("models-minha-palestra/src/models/Palestra")]} */
function getUsuarioEPalestra(req){
    const reqst = new Requester(req),
    token = reqst.getBodyParam("token", ""),
    palestra = reqst.getBodyParam("palestra", "");
    return Promise.all([UsuarioHelper.getUserByToken(token), PalestraHelper.getPalestra(palestra)]);
}

exports.gerar = (req,res) =>{
    getUsuarioEPalestra(req).then(([usuario, palestra])=>{
        if(
            !palestra.finalizada || !palestra.aprovada|| 
            !palestra.participantes || !palestra.participantes[usuario.getUid()]||
            !palestra.participantes[usuario.getUid()].compareceu
        ){
            res.status(400).send(new Resultado(-1, "Você não participou desta palestra!"));
            return;
        }
        QRCode.toDataURL(secret.siteURL+`/certificado/${palestra.getUid()}/${usuario.getUid()}`)
        .then((qrcode)=>{
            const data = {
                nomePalestra: palestra.nome,
                nomeCompleto: usuario.nome,
                dtPalestra: DateUtils.DDMMYYYY(palestra.dhApresentacao),
                cpf: usuario.cpf,
                qrcode,
            };
            GeradorPDF.gerarCertificado(data)
            .then((file)=>res.status(200).send(file))
            .catch(err=>res.status(400).send(err));
        })
        .catch(err=>{
            console.log(JSON.stringify(err));
            res.status(400).send(new Resultado(-1, "Ocorreu um problema ao gerar o QRCode, por favor, tente novamente."));
        })
    })
    .catch(err=>{
        console.log(JSON.stringify(err));
        res.status(400).send(err);
    })
}