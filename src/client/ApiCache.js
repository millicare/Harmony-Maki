export class ApiCache {
    constructor(props){
        this.key = "apiCache";
        const objStr = localStorage.getItem(this.key);
        if(!objStr) {
            localStorage.setItem(this.key, "{}");
        }
    }

    get(name) {
        const obj = JSON.parse(localStorage.getItem(this.key));
        return obj[name];
    }

    set(name, value) {
        const obj = JSON.parse(localStorage.getItem(this.key));
        localStorage.setItem(this.key, JSON.stringify({ ...obj, [name]: value }))
    }

}