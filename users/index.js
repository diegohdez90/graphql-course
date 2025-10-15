const express = require('express')
const graphql = require('express-graphql').graphqlHTTP

const app = express()

app.use('/graphql', graphql({
    graphiql: true
}))

app.listen(4000, () => {
    console.log('Listening in port 4000')
})
