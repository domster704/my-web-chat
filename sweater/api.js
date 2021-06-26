import express from 'express'
import * as config from './config.js'
import { Request, User } from './tools.js'
import cookieParser from 'cookie-parser';


export const router = express.Router();

/* 
                    Block 1
    <=================================================>
                   Message functionality
*/

router.use('/sendMessage', async (req, res) => {
    const data = req.body
    await config.dbChat.makeMessage(data.from, data.message, data.to);
    res.send({message: data.message})
});

router.use('/showMessage', async (req, res) => {
    const data = req.body
    const val = await config.dbChat.showOneMessages(data.from, data.to)

    res.send({data: val})
})

router.use('/getNewMessage', async (req, res) => {
    const data = req.body
    const message_list = await config.dbChat.showOneMessages(data.from, data.to)
    if (data.messagesSize != message_list.length) {
        console.log(message_list.slice(data.messagesSize - message_list.length));
        res.send({data: message_list.slice(data.messagesSize - message_list.length)})
    } else {
        res.send({data: 'similar'})
    }
})


/* 
                    Block 2
    <=================================================>
                    Authorization
*/

router.use('/register', async (req, res) => {
    if (await config.dbUsers.addUser(req.body.login, req.body.psw1, req.body.psw2, req.body.nick)) {
        config.user.id = await config.dbUsers.getId(req.body.login, req.body.psw1)
        config.user.nick = await config.dbUsers.getNickById(config.user.id)

        res.clearCookie('id')
        res.clearCookie('nick')
        res.cookie('id', config.user.id, {expire: config.MAX_AGE + Date.now()})
        res.cookie('nick', config.user.nick, {expire: config.MAX_AGE + Date.now()})
        res.send({id: config.user.id})
    } else {
        res.send(404)
    }
})

router.use('/login', async (req, res) => {
    if (await config.dbUsers.authorize(req.body.login, req.body.psw1)) {
        config.user.id = await config.dbUsers.getId(req.body.login, req.body.psw1)
        config.user.nick = await config.dbUsers.getNickById(config.user.id)

        res.clearCookie('id')
        res.clearCookie('nick')
        res.cookie('id', config.user.id, {expire: config.MAX_AGE + Date.now()})
        res.cookie('nick', config.user.nick, {expire: config.MAX_AGE + Date.now()})
        res.send({id: config.user.id})
    } else {
        res.send(404)
    }
})
