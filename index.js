const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

//routes
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const budgetRoutes = require("./routes/budgetRoutes")

//check toke
const verifyToken = require("./helpers/checkToken")

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

//routes express
app.use('/api/auth', authRoutes)
app.use('/api/user', verifyToken, userRoutes)
app.use('/api/budget', budgetRoutes)

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connection!")
    } catch (error) {
        console.log("Connection failed")
    }
}

connectDB().catch(console.dir)


app.get("/", (req, res) => {
    res.json({ msg: "Api funcionando!" })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})