import express from 'express'
import path from 'path'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import * as config from './config.js'
import { Request, User } from './tools.js'
import * as api from './api.js'

const __dirname = path.resolve()
export const app = express()
const port = 3000

app.set("views", "templates")
app.set('view engine', 'hbs')

app.use(express.static('static'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', api.router)
app.use(cookieParser())

app.use((req, res, next) => {
    if (req.cookies.id != NaN) {
        config.user.nick = req.cookies.id;
        
        if (req.cookies.nick != NaN || req.cookies.nick != "")
            config.user.nick = req.cookies.nick;
    }
    next()
})

app.get('/', (req, res) => {
    res.render('auth')
})

app.get('/profile/:username', async (req, res) => {
    if (req.cookies.id == req.params.username) {
        const body = await config.dbUsers.getAllUsers()
        res.render('index', { names: body, name: config.user.nick})
    } else if (req.cookies.id != NaN) {
        res.redirect('/profile/' + req.cookies.id)
    } else {
        res.redirect('/')
    }
})

app.listen(port)
