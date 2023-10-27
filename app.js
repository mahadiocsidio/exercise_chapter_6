const express = require('express')
const app = express()
const port = 3000
const authroutes = require('./routes/user.routes')
app.use(express.json())
//Routes

app.use('/api/v1',authroutes)
app.use('/api/v1/profile', profileRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app