const graphiql = require('graphql')

const {
    GraphQLObjectType,
    GraphQLString,
} = graphiql

const Company = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {
            type: GraphQLString,
        },
        name: {
            type: GraphQLString
        }
    }
})

module.exports = Company
