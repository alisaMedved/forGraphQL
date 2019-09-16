

const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID,
    GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const Movies = require('../models/movie');
const Directors = require('../models/director');

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
            id: {type: GraphQLID},
            name: {type: new GraphQLNonNull(GraphQLString)},
            age: {type: new GraphQLNonNull(GraphQLInt)},
            movies: {
                type: new GraphQLList(MovieType),
                resolve({id}, args) {
                    return Movies.find({ directorId: id});
                },
            },
        }
    ),
});

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString) },
        genre: {type: new GraphQLNonNull(GraphQLString)},
        rate: {type: GraphQLInt},
        watched: {type: new GraphQLNonNull(GraphQLBoolean)},
        director: {
            type: DirectorType,
            resolve({ directorId }, args) {
                return Directors.findById(directorId);
            },
        },
    })
});

const Mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
       addDirector: {
           type: DirectorType,
           args: {
               name: {type: new GraphQLNonNull(GraphQLString)},
               age: {type: new GraphQLNonNull(GraphQLInt)},
           },
           resolve(parent, {name, age}) {
               const director = new Directors({
                   name,
                   age,
               });
               return director.save();
           },
       },
       addMovie: {
           type: MovieType,
           args: {
               name: {type: new GraphQLNonNull(GraphQLString)},
               genre: {type: new GraphQLNonNull(GraphQLString)},
               rate: {type: GraphQLInt},
               watched: {type: new GraphQLNonNull(GraphQLBoolean)},
               directorId: {type: GraphQLID}
           },
           resolve(parent, {name, genre, rate, watched, directorId}) {
               const movie = new Movies({
                   name,
                   genre,
                   rate,
                   watched,
                   directorId,
               });
               return movie.save();
           }
       },
       deleteDirector: {
           type: DirectorType,
           args: { id: {type: GraphQLID}},
           resolve(parent, args) {
               return Directors.findByIdAndRemove(args.id);
           }
       },
       deleteMovie: {
           type: MovieType,
           args: { id: {type: GraphQLID}},
           resolve(parent, {id}) {
               return Movies.findByIdAndRemove(id);
           }
       },
       updateDirector: {
           type: DirectorType,
           args: {
               id: {type: GraphQLID},
               name: {type: new GraphQLNonNull(GraphQLString)},
               age: { type: new GraphQLNonNull(GraphQLInt)},
           },
           resolve(parent, {id, name, age}) {
               return Directors.findByIdAndUpdate(
                   id,
                   { $set: {name, age,}},
                   {new: true},
               );
           },
       },
       updateMovie: {
           type: MovieType,
           args: {
               id: {type: GraphQLID},
               name: {type: new GraphQLNonNull(GraphQLString)},
               genre: {type: new GraphQLNonNull(GraphQLString)},
               rate: {type: GraphQLInt},
               watched: {type: new GraphQLNonNull(GraphQLBoolean)},
               directorId: {type: GraphQLID}
           },
           resolve(parent, {name, genre, rate, watched, directorId}) {
               return Movies.findByIdAndUpdate(
                   args.id,
                   {$set: {name, genre, rate, watched, directorId}},
                   {new: true},
               )
           }
       }
   }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: {id: {type: GraphQLID}},
            resolve(parent, {id}) {
                return Movies.findById(id);
            }
        },
        director: {
            type: DirectorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, {id}) {
                return Directors.findById(id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            args: {name: {type: GraphQLString}},
            resolve(parent, {name}) {
                return Movies.find({name: {$regex: name, $options: "i"} });
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            args: { name: { type: GraphQLString } },
            resolve(parent, { name }) {
                return Directors.find({ name: { $regex: name, $options: "i" } });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});

