import request from "request";

export class Request {

    constructor(...options) {
        this.method = options[0]
        this.url = options[1]
        this.data = options[2]
        if (options.length >= 4)
            this.type = options[3]
        else
            this.type = 'POST'
    }

    then(resolve, reject) {
        if (this.method == 'POST') {
            request.post({
                method: this.method,
                url: this.url,
                qs: this.data
            }, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    resolve(this.type == "obj" ? this.#convertObjToArray(body) : this.#convertListToArray(body))
                }
                else
                    reject(err)
            })
        } else if (this.method == 'GET') {
            request.get({
                method: this.method,
                url: this.url,
            }, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    resolve(this.type == "obj" ? this.#convertObjToArray(body) : this.#convertListToArray(body))
                }
                else
                    reject(err)
            })
        } else reject('Вы сделали что-то не то')
            
    }

    #convertObjToArray(data) {
        let obj = {}

        const replacer1 = new RegExp('\n', 'g')
        const replacer2 = new RegExp('"', 'g')
        const replacer3 = new RegExp(' ', 'g')

        let a = data.slice(1, -2).replace(replacer1, '').replace(replacer2, '').replace(replacer3, '').split(',');

        for (let i in a) {
            const val = a[i].split(':')
            obj[val[0]] = isNaN(val[1]) ? val[i] : parseInt(val[i], 10)  // проверка на число
        }
        return obj
    }

    #convertListToArray(data) {
        let a = data.slice(1, -2)
        const replacer1 = new RegExp('\n', 'g')
        const replacer2 = new RegExp('"', 'g')
        a = a.replace(replacer1, '')
            .replace(replacer2, '')
            .split(',');
    
        for (let i = 0; i < a.length; i++)
            a[i] = a[i].trim()
    
        return a
    }
}

export class User {
    id = NaN
    nick = NaN

    constructor() {
        
    }
}