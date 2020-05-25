module.exports = class Requester{
    constructor(req){
        this.req = req;
        try{
            if(typeof req.body === "object") this.body = req.body;
            else this.body = JSON.parse(req.body);
        }
        catch(e){
            this.body = {};
        }
    }
    getBodyParam(name, defaultValue){
        return this.body[name] || defaultValue; 
    }
}