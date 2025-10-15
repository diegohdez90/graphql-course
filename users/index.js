const express = require('express')
const graphql = require('express-graphql').graphqlHTTP
const queries = require('./queries')

const app = express()

app.use('/graphql', graphql({
    schema: queries,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('Listening in port 4000')
})
