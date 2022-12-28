const express = require( 'express' );
const cors = require( 'cors' );
// const multer = require( 'multer' )
// const image = multer( { dest: 'images/' } )
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require( 'mongodb' );
require( 'dotenv' ).config();

const app = express();

// middleware
app.use( cors() );
app.use( express.json() );

// mongodb client connect
const uri = `mongodb+srv://${ process.env.DB_user }:${ process.env.DB_password }@cluster0.mdoqsyi.mongodb.net/?retryWrites=true&w=majority`;
// console.log( uri );
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 } );

async function run () {
    try {
        // const serviceCollection = client.db( 'TouristSpot' ).collection( 'services' )
        const postsCollection = client.db( 'socialAdda' ).collection( 'posts' )

        app.post( '/posts', async ( req, res ) => {
            const post = req.body;
            console.log( post );
            const result = await postsCollection.insertOne( post );
            res.json( result );
        } );
    }

    finally {

    }
}
run().catch( error => console.log( error ) )

app.get( '/', async ( req, res ) => {
    res.send( 'social adda server is running' );
} )

app.listen( port, () => console.log( `social adda server running on por ${ port }` ) )
