import pg from 'pg'
import bcrypt from 'bcrypt'


export class DBChat {
    #tableName = 'chat'

    constructor() {
        this.pool = new pg.Pool({
            user: "xrwlvxrfpizqbt",
            password: "4f8ca8216680cfde5f604e50d590cf1b44d4b4ff84a56866f54bd91e776b095b",
            host: "ec2-63-33-239-176.eu-west-1.compute.amazonaws.com",
            port: 5432,
            database: "d7fb91qksc0h36",
            ssl: {
                rejectUnauthorized: false,
            }
        })
    }

    async init() {
        this.client = await this.pool.connect()
    }

    async makeMessage(fromWho, message, toWho) {
        await this.client.query(`INSERT INTO ${this.#tableName} (fromWho, content, toWho) values($1, $2, $3)`, [fromWho, message, toWho])
    }

    async showAllMessages() {
        console.log((await this.client.query(`SELECT * FROM ${this.#tableName}`)).rows);
    }

    async showAllMessagesForPerson(client) {
        let a = []
        a.push((await this.client.query(`SELECT toWho FROM ${this.#tableName} WHERE fromWho='${client}'`)).rows)
        a.push((await this.client.query(`SELECT fromWho FROM ${this.#tableName} WHERE toWho='${client}'`)).rows)

        let allMes = new Set()
        for (let i in a)
            for (let j in a[i])
                allMes.add(a[i][j][Object.keys(a[i][j])[0]])

        return Array.from(allMes)
    }

    async showOneMessages(fromWho, toWho) {
        return (await this.client.query(`SELECT fromWho, content FROM ${this.#tableName} WHERE
                                         fromWho='${fromWho}' AND toWho='${toWho}'
                                         OR
                                         toWho='${fromWho}' AND fromWho='${toWho}'`)).rows
    }
}

export class DBUsers {
    #tableName = 'users'

    constructor() {
        this.pool = new pg.Pool({
            database: "d4oed1qeuui5rn",
			user: "pgdjwlfyejamox",
			password: "6a95b359dbd448d573bf8e0a9786d66fb6f99b42dd0834dc07342cb0490f6102",
			host: "ec2-54-155-254-112.eu-west-1.compute.amazonaws.com",
			port: "5432",
            ssl: {
                rejectUnauthorized: false,
            }
        })
    }

    async #hashPassword(...options) {
        if (options.length == 1) {
            const salt = await bcrypt.genSalt(10)
            const pswHash = await bcrypt.hash(options[0], salt)
            return [pswHash, salt]
        } else {
            const pswHash = await bcrypt.hash(options[0], options[1])
            return pswHash
        }
    }

    async init() {
        this.client = await this.pool.connect()
    }

    async addUser(name, psw1, psw2, username) {
        function checkValidPsw(p1, p2) {
            if (p1 == p2) {
                return true
            } else {
                return false
            }
        }

        if (checkValidPsw(psw1, psw2)) {
            const data = await this.#hashPassword(psw1)
            const password = data[0],
                  salt     = data[1]
            await this.client.query(`INSERT INTO ${this.#tableName} (name, password, salt, content, username)
                                     VALUES ($1, $2, $3, $4, $5)`, [name, password, salt, '', username])
            return true
        } else {
            return false
        }
    }

    async authorize(name, psw) {
        try {
            const data = (await this.client.query(`SELECT password, salt FROM ${this.#tableName} WHERE name='${name}'`)).rows[0]
            const passwordHash = data.password
            const password = await this.#hashPassword(psw, data.salt)
    
            return password.toString() == passwordHash.toString()
        } catch(e) {
            throw new Error(e)
        }
        
    }

    async getNickById(id) {
        const a = (await this.client.query(`SELECT username FROM ${this.#tableName} WHERE id=${id}`)).rows[0].username
        console.log(a)
        return a
    }

    async getId(name, psw) {
        const salt = (await this.client.query(`SELECT salt FROM ${this.#tableName} WHERE name='${name}'`)).rows[0]
        const password = await this.#hashPassword(psw, salt.salt)
        const a = (await this.client.query(`SELECT id FROM ${this.#tableName} WHERE name='${name}' AND password='${password}'`)).rows[0].id
        return a
    }

    async getAllUsers() {
        return (await this.client.query(`SELECT username FROM ${this.#tableName}`)).rows
    }
}


// console.log(await DBUsers.hashPassword("dan28dan"))


// $2b$10$BKaDbTGHeadJS2Ij9B6s9e4xDmfJQzXzYBica.AC.nYVCIu9yw06W
// '$2b$10$BKaDbTGHeadJS2Ij9B6s9e'