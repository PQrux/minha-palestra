import firebase from "firebase";
import "firebase/storage";
import { Resultado, FirestoreObject } from "models-minha-palestra";
import LogHelper from "./LogHelper";

export default class FileHelper{
    /**
     * @param {boolean} multiple Define se devem ser capturados múltiplos arquivos.
     * @param {string} acceptType Define restrição de tipo de arquivos.
     * @param {boolean} capture Define se devem ser utilizados os recursos do aparelho, como câmera por exemplo.
     * @returns {Promise.<Array<File>>}
     */
    static getFiles(multiple, acceptType, capture){
        return new Promise(async (resolve,reject)=>{
            var fileSelector = document.createElement('input');
            fileSelector.setAttribute('type', 'file');
            if(multiple) fileSelector.setAttribute("multiple", true);
            if(acceptType) fileSelector.setAttribute("accept", acceptType);
            if(capture) fileSelector.setAttribute("capture", true);
            fileSelector.onchange = ()=>{ 
                if (!fileSelector.files) { 
                    reject("Impossível carregar arquivos no seu navegador!");
                    return 0;
                }
                else{
                    let list = [];
                    for(let i=0;i<fileSelector.files.length;i++){
                        list.push(fileSelector.files[i]);
                    }
                    resolve(list);
                }
            }
            document.body.onfocus = ()=>{
                setTimeout(() => {
                    if(fileSelector.files.length < 1){
                        resolve([]);
                    }
                    document.body.onfocus = null;
                }, 600);
            }
            fileSelector.click();
        });
    }
    /**
     * 
     * @param {function(nErrorFiles: number, nTransfdFiles: number, nTotalFiles: number, bytesTransfd: number, nTotalBytes: number)} progressCallback Callback usada para Visualizar o progresso do envio dos arquivos.
     * @param {Array<File>} files Arquivos a serem lançados.
     * @param {FirestoreObject["prototype"]} obj Objeto onde serão armazenadas as informações.
     * @param {string} prop Propriedade onde será armazenada a informação. 
     * @param {boolean} propIsArray Define se a propriedade é uma Array, o comportamento padrão é que seja uma string, portanto sempre sobrescreverá essa propriedade com a string da URL do primeiro arquivo enviado. 
     * @param {boolean} overrideProp Define se a propriedade sendo Array deve ser sobrescrita ou sobrecarregada.
     * @returns {Promise.<FirestoreObject["prototype"]>}
     */
    static saveFiles(progressCallback, files, obj, prop, propIsArray, overrideProp){
        return new Promise(async (resolve,reject)=>{
            let dados = {files, obj, prop, propIsArray, overrideProp};
            if(!Array.isArray(files)){
                reject(new Resultado(-1, "Arquivos inválidos.", null, dados));
                return;
            }
            if(files.length < 1){
                reject(new Resultado(-1, "Nenhum arquivo sendo enviado.", null, dados));
                return;
            }
            if(!(obj instanceof FirestoreObject)||!obj.path){
                reject(new Resultado(-1, "Alvo inexistente.", null, dados));
                return;
            }
            if(!prop){
                reject(new Resultado(-1, "Nenhuma propriedade selecionada.", null, dados));
                return;
            }
            let 
                finalizado = false,
                nErrorFiles = 0,
                nTransfdFiles = 0, 
                nTotalFiles = files.length, 
                bytesTransfd = 0,
                nTotalBytes = files.reduce((total,item)=>total+item.size, 0),
                urls = [];
            ;
            /**
             * @param {import("firebase").storage.UploadTask} currentUpload 
             * @param {import("firebase").storage.UploadTaskSnapshot} snap 
             * @param {{b: number}} progress
             */
            let onProgress = async (currentUpload, snap, progress) => {
                if(snap && !finalizado){
                    bytesTransfd = (bytesTransfd - progress.b) + snap.bytesTransferred;
                    progress.b = snap.bytesTransferred;
                    if(progressCallback) progressCallback(nErrorFiles, nTransfdFiles, nTotalFiles, bytesTransfd, nTotalBytes);
                    console.log("em andamento.")
                    console.log({nErrorFiles, nTransfdFiles, nTotalFiles, bytesTransfd, nTotalBytes});
                }
            }
            /**
             * @param {import("firebase").storage.UploadTask} currentUpload
             */
            let onError = async (currentUpload, err) => {
                console.log(currentUpload, err);
                nErrorFiles++;
            }
            /**
             * @param {import("firebase").storage.UploadTask} currentUpload 
             */
            let onComplete = async (currentUpload, unsubscribe) => {
                let ok = true;
                finalizado = true;
                if(unsubscribe) unsubscribe();
                let url = await currentUpload.snapshot.ref.getDownloadURL()
                .catch(err=>{
                    console.log(err);
                    ok = false;
                    nErrorFiles++;
                })
                if(ok){
                    urls.push(url);
                    nTransfdFiles++;
                }
                if(nTransfdFiles+nErrorFiles === nTotalFiles){
                    console.log("comitando.")
                    if(propIsArray){
                        if(overrideProp) obj[prop] = urls;
                        else {
                            if(!Array.isArray(obj[prop])) obj[prop] = [];
                            obj[prop] = obj[prop].concat(urls);
                        }
                    }
                    else{
                        obj[prop] = urls[0];
                    }
                    LogHelper.logarECommitar([obj.path], "ATUALIZACAO", "Adicionado fotos", obj).then(()=>{
                        console.log("concluído");
                        console.log(obj);
                        resolve(obj);
                    })
                    .catch(err=>{
                        reject(new Resultado(-1, "Erro ao atualizar informações.", err, dados));
                    })
                }
            }
            files.forEach(file=>{
                let currentUpload = firebase.storage().ref(obj.path).child(new Date().getTime().toString()).put(file);
                let progress = {b: 0};
                currentUpload.on(firebase.storage.TaskEvent.STATE_CHANGED, 
                    (snap)=>{onProgress(currentUpload, snap, progress)}, 
                    (err)=>{onError(currentUpload, err)},
                    (unsubscribe)=>{onComplete(currentUpload, unsubscribe)}
                );
            })
        });
    }
}