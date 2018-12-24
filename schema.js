const axios = require('axios')

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require("graphql");

// Launch Type
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    lauch_year: { type: GraphQLString },
    lauch_date_local: { type: GraphQLString },
    lauch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType }
  })
});

// Rocket Type
const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString }
  })
});

const spaceX_rest_api = 'https://api.spacexdata.com/v3/';

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    launches: {
        type: new GraphQLList(LaunchType),
        resolve(parent,args){
            return axios.get(spaceX_rest_api+'launches')
            .then(res => res.data);
        }
    },
    launch: {
        type: LaunchType,
        args: {
            flight_number: {type: GraphQLInt}
        },
        resolve(parent,args){
            return axios.get(spaceX_rest_api+`launches/${args.flight_number}`)
            .then(res => res.data);
        }
    },
    rockets: {
        type: new GraphQLList(RocketType),
        resolve(parent,args){
            return axios.get(spaceX_rest_api+'rockets')
            .then(res => res.data);
        }
    },
    rocket: {
        type: RocketType,
        args: {
            rocket_id: {type: GraphQLInt}
        },
        resolve(parent,args){
            return axios.get(spaceX_rest_api+`rockets/${args.rocket_id}`)
            .then(res => res.data);
        }
    }
  }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});