export default class ModalHelper{
    static open(content, withCloseButton){
        if(window.modal){
            window.modal.open(content, withCloseButton);
        }
    }
    static close(){
        if(window.modal){
            window.modal.close();
        }
    }
    static setState(state){
        if(window.modal){
            window.modal.setState(state);
        }
    }
    static getState(){
        if(window.modal){
            return window.modal.getState();
        }
    }
}