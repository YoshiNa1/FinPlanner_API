require('dotenv').config()
// require('./models/models') // refresh db, don't refresh columns (add-delete new properties)
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sequelize = require("./db")
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/error-middleware')

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
    } catch(e) {
        console.log(e)
    }
}

start()