/**
 *  Simple HTTP REST server
 * 
 *  Post and get simple text messages. Each message has a text content, a list of tags
 *  and an associated timestamp
 * 
 * 
 *  Endpoints          Attributes          Method        Description
 * 
 *     /                  -                  GET         Returns the version and a list of available endpoints
 *     /messages          -                  GET         Returns all the posted messages
 *     /messages          -                  POST        Post a new message
 *     /messages        ?index=<n>           DELETE      Delete the n^th message
 * 
 * 
 *     Note: all the endpoints are prefixed with /api/v1/, so the full URL
 *           looks like:   http://server:port/api/v1/messages
 * 
 * ------------------------------------------------------------------------------------ 
 *  To install the required modules:
 *  $ npm install
 * 
 *  To compile:
 *  $ npm run compile
 *  or
 *  $ npx tsc
 * 
 *  To run:
 *  $ node postmessages
 * 
 */


// TypeScript modules import

import * as http from 'http';                 // HTTP module
import * as url from 'url';                   // URL module (for parsing request)

import {Message, isMessage} from './Message';

// CommonJS modules import

import fs = require('fs');                    // filesystem module
import colors = require('colors');
colors.enabled = true;



// Shared state concurrency: All our messages will be kept here
let messages: Message[] = [];


// All the incoming messages will also be written to a text file
let ostream: fs.WriteStream;




let server = http.createServer( ( req, res ) => {

    // This function will be invoked asynchronously for every incoming connection

    console.log("New connection".inverse);
    console.log("REQUEST:")
    console.log("     URL: ".red + req.url );
    console.log("  METHOD: ".red + req.method );
    console.log(" Headers: ".red + JSON.stringify( req.headers ) );

    function send_response( status_code:number, response_data:object )
    {
        console.log("RESPONSE:");
        console.log(`Status: ${status_code}`);
        console.log(`Body: ${JSON.stringify(response_data)}`);

        res.writeHead(status_code, { "Content-Type": "application/json" });
        res.write( JSON.stringify(response_data), "utf-8");
        res.end();
        console.log("Response finished".inverse);
    }

    let body: string = "";


    // data event is fired every time a new body 
    // chunk is sent by the client
    req.on("data", ( chunk ) => {
        body = body + chunk;

    });


    // The "end" event is fired when client's
    // request is complete. We can now proceed with the response
    //
    req.on("end", () => {

        console.log("Request end");

        if( req.url == "/api/v1/" && req.method=="GET") {
            let response_data = {
                                "version": "1.0.0",
                                "endpoints": [
                                    "GET /",
                                    "GET /messages",
                                    "POST /messages",
                                    "DELETE /messages?index=<n>"
                                ]
                            }

            send_response( 200, response_data);

            // Do you want to test the NodeJS event loop? Uncomment
            // the following line to delay the response, and verify
            // that other clients/endpoints are unaffected by this change:

            //setTimeout( ()=>{ send_response(res,200,response_data); }, 5000);

            return;
        }
        else if( req.url == "/api/v1/messages" && req.method == "GET" ) {

            send_response( 200, messages );
            return;
        }
        else if( req.url == "/api/v1/messages" && req.method == "POST" ) {
            console.log("Received: " + body);

            try {
                let recvmessage = JSON.parse(body);
                // Add the timestamp
                recvmessage.timestamp = new Date();
                
                if( isMessage( recvmessage ) ) {
                    messages.push( recvmessage );
                    ostream.write(  JSON.stringify( recvmessage ) + "\n", 'utf8', () => {
                        console.log("Message appended to file");
                    });

                    send_response( 200, {error:false, errormessage:""});
                    return;

                } else {

                    send_response( 400, { error: true, errormessage: "Data is not a valid Message" } );
                    return;
                }

            } catch( e ) {

                send_response( 400, {error:true, errormessage:"JSON parse failed."});
                return;
            }
        }
        else if( req.url && req.url.search( "/api/v1/messages" )!=-1 && req.method == "DELETE" ) {
            let parsedquery = url.parse( req.url, true /* true=parse query string*/).query;
            console.log(" Query: ".red + JSON.stringify(parsedquery));

            let query:string = <string>(parsedquery.index)
            let queryidx:number = parseInt( query );

            if( queryidx < messages.length ) {
                messages[ queryidx ] = messages[ messages.length-1 ];
                messages.pop();

                send_response( 200, {error:false, errormessage:""});
                return;

            } else {
                send_response( 400, {error:true, errormessage:"Invalid index"});
                return;
            }
        }
        else if( req.url === "/api/v1/hash" ) {

            // Secret endpoint, just to demonstrate why non-blocking functions
            // are crucial in node.js

            const crypto = require('crypto');
            const ITERATIONS = 30000000;

            // async version
            /***/ 
            crypto.pbkdf2('password123', 'salt', ITERATIONS, 64, 'sha512', (err:any, key:any) => {
                send_response( 200, { hash: key.toString("base64") });
            });
            /**/

            // sync version
            /**
            const key = crypto.pbkdf2Sync('password123', 'salt', ITERATIONS, 64, 'sha512');
            send_response( 200, { hash: key.toString("base64") });
            */



        }
        else {

            send_response( 404, { error:true, errormessage:"Invalid endpont/method"} );

        }

    });

});


server.listen( 8080, () => {
    console.log("HTTP Server started on port 8080");
    ostream = fs.createWriteStream('messagelog.txt');
});


console.log("Server setup complete");
