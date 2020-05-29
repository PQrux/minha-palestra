const fs = require("fs");
const pdf = require('html-pdf');
const jsdom = require("jsdom").JSDOM;
const { Resultado } = require("models-minha-palestra");

module.exports = class GeradorPDF{
    /**
     * Gera o PDF de certificado de palestra.
     * @param {Object} data Informações a serem injetadas no PDF.
     * @returns {Promise.<Blob>}
     */
    static gerarCertificado(data){
        return new Promise(async (resolve,reject)=>{
            data = data || {};
            fs.readFile(__dirname+"/assets/index.html", 'utf8', (err, txt)=>{
                if(err){
                    reject(new Resultado(-1, "Erro ao buscar PDF.", err));
                    return;
                }
                let html = new jsdom(txt);
                for(let key in data){
                    let placeholders = html.window.document.getElementsByName(key);
                    for(let j=0;j<placeholders.length;j++){
                        let placeholder = placeholders[j];
                        if(placeholder.tagName === "SPAN") placeholder.innerHTML = data[key];
                        else if(placeholder.tagName === "IMG") placeholder.setAttribute("src", data[key]);
                    }
                }
                pdf.create(html.serialize(), {
                    orientation: "landscape",
                    format: "A4",
                }).toBuffer(function(err, buff) {
                    if (err){
                        reject(new Resultado(-1, "Erro ao gerar Certificado."));
                    }
                    else{
                        let json = buff.toJSON();
                        resolve(json);
                    }
                });
         
            });
        });
    } 
}