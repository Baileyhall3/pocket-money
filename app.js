const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs')

const user = {
    firstName: 'Bailey',
    lastName: 'Hall',
}

const accounts = [
    {id: 1, name: "Barclays"},
    {id: 2, name: "Monzo"},
    {id: 3, name: "Account 1", sharedWithId: 3},

]

app.get('/', (req, res) => {
    res.render('pages/index', {
        user: user
    })
})

app.get('/accounts', (req, res) => {
    res.render('pages/accounts', {
        accounts: accounts
    })
})

app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})