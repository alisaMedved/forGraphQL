const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = 3005;

mongoose.connect('mongodb+srv://admin:admin@cluster0-7ewfa.mongodb.net/forGraphQL?retryWrites=true&w=majority',
    {useNewUrlParser: true});

app.use(cors());

app.use('/graphql', graphqlHTTP(
    {
        schema,
        graphiql: true,
    }
));



const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.on('open', () => console.log('Connected to DB!'));

app.listen(PORT, err => {
    err ? console.log(error) : console.log('Server started!');
});
