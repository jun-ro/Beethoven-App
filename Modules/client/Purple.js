export class Purple{
    constructor(){

    }
    Store(key, value){
        localStorage.setItem(key, value)
    }
    Read(key){
        return localStorage.getItem(key)
    }
}