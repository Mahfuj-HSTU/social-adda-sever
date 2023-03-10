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
        const usersCollection = client.db( 'socialAdda' ).collection( 'users' )
        const commentsCollection = client.db( 'socialAdda' ).collection( 'reacts' )

        app.post( '/posts', async ( req, res ) => {
            const post = req.body;
            // console.log( post );
            const result = await postsCollection.insertOne( post );
            res.send( result );
        } );

        // get posts
        app.get( '/posts', async ( req, res ) => {
            const posts = {}
            const result = await postsCollection.find( posts ).toArray();
            res.send( result );
        } );

        // post details
        app.get( '/posts/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const post = await postsCollection.findOne( query )
            res.send( post )
        } )

        // get comments
        app.get( '/comments/:postId', async ( req, res ) => {
            // console.log( req.params.postId );
            const postId = req.params.postId
            const result = await commentsCollection.find( { post: postId } ).toArray();
            res.send( result )
        } )

        app.post( '/comments', async ( req, res ) => {
            const comment = req.body;
            const result = await commentsCollection.insertOne( comment );
            res.send( result );
            // console.log( comment )
        } );


        // post users
        app.post( '/users', async ( req, res ) => {
            const user = req.body;
            const result = await usersCollection.insertOne( user );
            res.send( result )
        } )

        app.get( '/users', async ( req, res ) => {
            const user = {}
            const result = await usersCollection.find( user ).toArray();
            res.send( result )
        } )


        // get specific users
        app.get( '/users/:email', async ( req, res ) => {
            const email = req.params.email;
            const query = { email: email };
            // console.log( query )
            const result = await usersCollection.findOne( query );
            // console.log( result );
            res.send( result )
        } )

        // update user
        app.put( '/users/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) }
            const user = req.body;
            // console.log( user )
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                    photoUrl: user.photoUrl,
                    institute: user.institute,
                    address: user.address
                }
            }
            const result = await usersCollection.updateOne( query, updatedUser, option )
            res.send( result )
        } )

        app.put( '/posts/:id', async ( req, res ) => {
            const id = req.params.id;
            // console.log( id )
            const query = { _id: ObjectId( id ) }
            const user = req.body;
            console.log( user )
            const option = { upsert: true }
            // const updatedUser = {
            //     $set: {
            //         name: user.name,
            //         email: user.email,
            //         photoUrl: user.photoUrl,
            //         institute: user.institute,
            //         address: user.address
            //     }
            // }
            // const result = await usersCollection.updateOne( query, updatedUser, option )
            // res.send( result )
        } )

    }

    finally {

    }
}
run().catch( error => console.log( error ) )

app.get( '/', async ( req, res ) => {
    res.send( 'social adda server is running' );
} )

app.listen( port, () => console.log( `social adda server running on por ${ port }` ) )
