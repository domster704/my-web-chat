import { DBChat, DBUsers } from './db.js'
import { User } from './tools.js'


export const MAX_AGE = 60 * 60 * 24 * 365 * 1000  // 1 год

export const dbChat = new DBChat()
await dbChat.init()

export const dbUsers = new DBUsers()
await dbUsers.init()

export const user = new User()


