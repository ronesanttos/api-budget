const router = require('express').Router()
const jwt = require('jsonwebtoken')

const User = require("../models/user")
const Budget = require("../models/budget")

const verifyToken = require("../helpers/checkToken")
const getUserToken = require("../helpers/getToken")

router.post("/", verifyToken, async (req, res) => {
    const name_cliente = req.body.name_cliente
    const anddress = req.body.anddress
    const contact = req.body.contact
    const service = req.body.service
    const details = req.body.details
    const unit_price = req.body.unit_price
    const qtd = req.body.qtd

    if (service == null) {
        res.status(400).json({ error: "Adicione um servico, campo obrigatório!" })
    }

    const token = req.header("auth-token")
    const userToken = await getUserToken(token)

    const userId = userToken._id.toString()

    try {
        const user = await User.findOne({ _id: userId })

        const budget = new Budget({
            name_cliente: name_cliente,
            anddress: anddress,
            contact: contact,
            service: service,
            details: details,
            unit_price: unit_price,
            qtd: qtd,
            userId: user._id.toString()
        })

        try {
            const newBudget = await budget.save()

            res.json({ error: null, msg: "Orçamento criado com sucesso!", data: newBudget })
        } catch (error) {
            return res.status(400).json({ error })
        }
    } catch (error) {
        return res.status(400).json({ error: "Acesso negado!" })
    }
})

router.get("/my_budgets", verifyToken, async (req, res) => {
    try {
        const token = req.header("auth-token")
        const user = await getUserToken(token)
        const userId = user._id.toString()

        const budget = await Budget.find({ userId: userId })

        return res.json({ error: null, budget: budget })

    } catch (error) {
        return res.status(400).json({ error })
    }
})


router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const budget = await Budget.findOne({ _id: id })

        if (budget) {
            res.json({ error: null, budget: budget })
        }
        else {
            const token = req.header("auth-token")
            const user = await getUserToken(token)

            const userId = user._id.toString()
            const budgetUserId = budget.userId.toString()

            if (userId == budgetUserId) {
                res.json({ error: null, budget: budget })
            }
        }

    } catch (error) {
        return res.status(400).json({ error: "Orçamento não encontrado!" })
    }
})


router.delete("/", verifyToken, async (req, res) => {
    const token = req.header("auth-token")
    const user = await getUserToken(token)

    const budgetId = req.body.id
    const userId = user._id.toString()

    try {
        await Budget.deleteOne({ _id: budgetId, userId: userId })
        return res.json({ error: null, msg: "Orçamento deletado com sucesso!" })
    } catch (error) {
        return res.status(400).json({ error: "Acesso negado!" })
    }
})

router.patch("/:id", verifyToken, async (req, res) => {
    const id = req.params.id
    const name_cliente = req.body.name_cliente
    const anddress = req.body.anddress
    const contact = req.body.contact
    const service = req.body.service
    const details = req.body.details
    const unit_price = req.body.unit_price
    const qtd = req.body.qtd

    const budget = await Budget.findOne({ _id: id })

    const token = req.header("auth-token")
    const userToken = await getUserToken(token)
    const userId = userToken._id.toString()

    if (id != budget._id) {
        return res.status(400).json({ error: "Acesso negado!" })
    }

    const newBudget = {
        id: id,
        name_cliente: name_cliente,
        anddress: anddress,
        contact: contact,
        service: service,
        details: details,
        unit_price: unit_price,
        qtd: qtd,
        userId: userId
    }

    try {
        const updateBudget = await Budget.findOneAndUpdate({ _id: id }, { $set: newBudget }, { new: true })
        return res.json({ error: null, msg: "Atualizado com sucesso!", data: updateBudget })
    } catch (error) {
        res.status(400).json({ error })
    }

})
module.exports = router