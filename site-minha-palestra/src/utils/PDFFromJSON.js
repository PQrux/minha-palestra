import saveAs from "save-as";

export default function PDFFromJSON(json, name){
    if(typeof json === "object"){
        let buffer = Buffer.from(json);
        let arquivo = new Blob([buffer],{type: "application/pdf"});
        saveAs(arquivo, name+".pdf");
    }
}