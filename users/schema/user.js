const graphiql = require('graphql')
const Company = require('./company')
const { default: axios } = require('axios')

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt
} = graphiql

const User = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: {
			type: GraphQLString,
		},
		firstName: {
			type: GraphQLString
		},
		age: {
			type: GraphQLInt
		},
		companyId: {
			type: Company,
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(res => res.data)
				
			}
		}
	}
})

module.exports = User
