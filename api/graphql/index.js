const { ApolloServer, gql } = require('apollo-server-azure-functions');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        name() {
            return 'John Hall'
        },
        location() {
            return 'Vermont'
        },
        bio() {
            return 'I am learning GraphQL!'
        }
    }
};


const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();

// module.exports = async function (context, req) {
//     context.log('JavaScript HTTP trigger function processed a request.');
//
//     const name = (req.query.name || (req.body && req.body.name));
//     const responseMessage = name
//         ? "Hello, " + name + ". This HTTP triggered function executed successfully."
//         : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
//
//     context.res = {
//         // status: 200, /* Defaults to 200 */
//         body: responseMessage
//     };
// }
