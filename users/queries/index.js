const graphql = require('graphql');
const User = require('../schema/user');
const _ = require('lodash')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema
} = graphql

users = [
    {
        id: "1",
        firstName: 'John',
        age: 33
    },
    {
        id: "2",
        firstName: 'Paul',
        age: 31
    },
    {
        id: "3",
        firstName: 'George',
        age: 30
    },
    {
        id: "4",
        firstName: 'Ringo',
        age: 34
    },
    {
        id: "5",
        firstName: 'Freddy',
        age: 20
    }
]

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        user: {
            type: User,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                return _.find(users, {
                    id: args.id
                })
            }
        }
    }
})

const queries = new GraphQLSchema({
    query: RootQuery
})

module.exports = queries
