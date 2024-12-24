const mongoose = require("mongoose")

const BudgetSchema = new mongoose.Schema({
    name_cliente: {
        type: String,
    },
    anddress: {
        type: String,
    },
    contact: {
        type: Number
    },
    service: {
        type: Array,
        required: true
    },
    details: {
        type: Array
    },
    unit_price: {
        type: Number
    },
    qtd: {
        type: Number
    },
    userId: {
        type: mongoose.ObjectId
    }
})

const Budget = mongoose.model("Budget", BudgetSchema)

module.exports = Budget