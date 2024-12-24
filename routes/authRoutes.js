const router = require('express').Router()
const bcryptJs = require("bcryptjs")
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Token = process.env.TOKEN
const User = require("../models/user")

router.post("/register", async (req, res) => {
    const name = req.body.name
    const company = req.body.company
    const whats = req.body.whats
    const email = req.body.email
    const password = req.body.password
    const confirmPass = req.body.confirmPass

    try {

        // verifica os campos 
        if (name == null || company == null || whats == null || email == null || password == null || confirmPass == null) {
            return res.status(400).json({ error: "Preencha todos os campos!" })
        }

        // valida senha
        if (password != confirmPass) {
            return res.status(400).json({ error: "As senhas precisam ser iguais!" })
        }

        //valida email
        const emailExists = await User.findOne({ email: email })

        if (emailExists) {
            return res.status(400).json({ error: "Este e-mail já está em uso!" })
        }


        //criptografa senha
        const salt = await bcryptJs.genSalt(12)
        const reqPassword = req.body.password

        const passwordHash = await bcryptJs.hash(reqPassword, salt)

        const user = await User({
            name: name,
            email: email,
            company:company,
            whats: whats,
            password: passwordHash
        })

        const newUser = await user.save()

        //criar token para usuario

        const token = jwt.sign({
            name: newUser.name,
            id: newUser.id,
        },
            Token
        )

        res.json({ error: null, msg: "Usuário cadastrado com sucesso!", token: token, userId: newUser._id })


    } catch (error) {
        res.status(400).json({ error })
    }
})

router.post("/login", async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({ email: email })

    //check user exist

    if (!user) {
        return res.status(400).json({ error: "Não há usuário cadastrado neste e-mail!" })
    }

    //check password
    const checkPassword = await bcryptJs.compare(password, user.password)

    if (!checkPassword) {
        return res.status(400).json({ error: "Senha invalida!" })
    }

    try {
        //cria token
        const token = jwt.sign({
            name: user.name,
            id: user._id,
        }, Token)

        res.json({ error: null, msg: "Você está autenticado!", token: token, userId: user._id })

    } catch (error) {
        res.status(400).json({ error })
    }
})

module.exports = router

/*
 "msg": "Usuário cadastrado com sucesso!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUm9uZSIsImlkIjoiNjc2OWRhYzNmODE4NmUwOTM0MjFjOGQ3IiwiaWF0IjoxNzM0OTkwNTMxfQ.3FOPC1_skukGGwSGcCzONB4diow9bI02zKdaUlIHqyE",

    "userId": "6769dac3f8186e093421c8d7"


    "name": "Rone",
    "email": "rone@gmail.com",
    "password": "1234",

    */