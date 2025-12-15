const graphql = require('graphql');
const axios = require('axios')
const User = require('../schema/user');
const Company = require('../schema/company')
const _ = require('lodash')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema
} = graphql

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
            resolve(_, args) {
                return axios
                        .get(`http://localhost:3000/users/${args.id}`)
                        .then(res => res.data)
            }
        },
        company: {
            type: Company,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(_, args) {
                return axios
                        .get(`http://localhost:3000/companies/${args.id}`)
                        .then(res => res.data)
            }
        }
    }
})

const queries = new GraphQLSchema({
    query: RootQuery
})

module.exports = queries
