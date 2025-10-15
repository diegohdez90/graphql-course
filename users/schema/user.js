const graphiql = require('graphql')

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
	}
})

module.exports = User
