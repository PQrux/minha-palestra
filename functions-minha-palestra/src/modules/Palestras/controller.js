const { Requester } = require("../../Utils");
const { UsuarioHelper, PalestraHelper, EventoHelper } = require("../../services");
const { Resultado } = require("models-minha-palestra");

/**@returns {Promise<[import("models-minha-palestra/src/models/Usuario"), import("models-minha-palestra/src/models/Palestra")]} */
function getUsuarioEPalestra(req){
    const reqst = new Requester(req),
    token = reqst.getBodyParam("token", ""),
    palestra = reqst.getBodyParam("palestra", "");
    return Promise.all([UsuarioHelper.getUserByToken(token), PalestraHelper.getPalestra(palestra)]);
}
exports.inscrever = (req,res) =>{
    getUsuarioEPalestra(req)
    .then(async ([usuario, palestra])=>{
        if(palestra.finalizada || !palestra.aprovada || palestra.cancelada){
            res.status(400).send(new Resultado(-1, "Você não pode se inscrever em palestras desautorizadas, finalizadas ou canceladas!"));
            return;
        }
        if(Object.getOwnPropertyNames(palestra.participantes).length+1 > palestra.limiteDeParticipantes){
            res.status(400).send(new Resultado(-1, "Esta palestra já está lotada!"));
            return;
        }
        if(palestra.evento){
            let ok = true;
            const [ evento, palestras ] = await Promise.all([EventoHelper.buscarEvento(palestra.evento), PalestraHelper.palestrasPorUsuarioEEvento(usuario.path, palestra.evento)])
            .catch(err=>{
                ok = false;
                console.log(JSON.stringify(err));
                res.status(400).send(err);
            });
            if(!ok) return;
            if(evento && palestras && evento.limiteInscricoes && evento.limiteInscricoes <= palestras.length){
                res.status(400).send(new Resultado(-1, "Você já atingiu o limite de inscrições neste evento!"));
                return;
            }
        }
        palestra.addParticipante(usuario);
        PalestraHelper.salvarPalestra(palestra).then(()=>{
            res.status(200).send({});
        })
        .catch(err=>{
            console.log(JSON.stringify(err));
            res.status(400).send(err);
        })
    })
    .catch(err=>{
        console.log(JSON.stringify(err));
        res.status(400).send(err);
    })
}
exports.desinscrever = (req,res) =>{
    getUsuarioEPalestra(req)
    .then(([usuario, palestra])=>{
        if(palestra.finalizada){
            res.status(400).send(new Resultado(-1, "Você não pode se desinscrever de palestras já concluídas!"));
            return;
        }
        palestra.removeParticipante(usuario);
        PalestraHelper.salvarPalestra(palestra).then(()=>{
            res.status(200).send({});
        })
        .catch(err=>{
            console.log(JSON.stringify(err));
            res.status(400).send(err);
        })
    })
    .catch(err=>{
        console.log(JSON.stringify(err));
        res.status(400).send(err);
    })
}