const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes/user.routes')
app.use(express.json())
//Routes
app.use('/api/v1/user',routes)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
