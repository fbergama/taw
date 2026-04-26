"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const url = __importStar(require("url"));
const Message_1 = require("./Message");
const fs = require("fs"); // filesystem module
const colors = require("colors");
colors.enabled = true;
// Shared state concurrency: All our messages will be kept here
let messages = [];
// All the incoming messages will also be written to a text file
let ostream;
let server = http.createServer((req, res) => {
    // This function will be invoked asynchronously for every incoming connection
    console.log("New connection".inverse);
    console.log("REQUEST:");
    console.log("     URL: ".red + req.url);
    console.log("  METHOD: ".red + req.method);
    console.log(" Headers: ".red + JSON.stringify(req.headers));
    let body = "";
    // data event is fired every time a new body 
    // chunk is sent by the client
    req.on("data", (chunk) => {
        body = body + chunk;
    });
    // The "end" event is fired when client's
    // request is complete. We can now proceed with the response
    //
    req.on("end", () => {
        console.log("Request end");
        let response_data = {
            error: true,
            errormessage: "Invalid endpoint/method"
        };
        let status_code = 404;
        if (req.url == "/api/v1/" && req.method == "GET") {
            status_code = 200;
            response_data = {
                "version": "1.0.0",
                "endpoints": [
                    "GET /",
                    "GET /messages",
                    "POST /messages",
                    "DELETE /messages?index=<n>"
                ]
            };
        }
        if (req.url == "/api/v1/messages" && req.method == "GET") {
            status_code = 200;
            response_data = messages;
        }
        if (req.url == "/api/v1/messages" && req.method == "POST") {
            console.log("Received: " + body);
            try {
                let recvmessage = JSON.parse(body);
                // Add the timestamp
                recvmessage.timestamp = new Date();
                if ((0, Message_1.isMessage)(recvmessage)) {
                    messages.push(recvmessage);
                    ostream.write(JSON.stringify(recvmessage) + "\n", 'utf8', () => {
                        console.log("Message appended to file");
                    });
                    status_code = 200;
                    response_data = { error: false, errormessage: "" };
                }
                else {
                    status_code = 400;
                    response_data = { error: true, errormessage: "Data is not a valid Message" };
                }
            }
            catch (e) {
                status_code = 400;
                response_data = {
                    error: true,
                    errormessage: "JSON parse failed"
                };
            }
        }
        if (req.url && req.url.search("/api/v1/messages") != -1 && req.method == "DELETE") {
            let parsedquery = url.parse(req.url, true /* true=parse query string*/).query;
            console.log(" Query: ".red + JSON.stringify(parsedquery));
            let query = (parsedquery.index);
            let queryidx = parseInt(query);
            if (queryidx < messages.length) {
                messages[queryidx] = messages[messages.length - 1];
                messages.pop();
                status_code = 200;
                response_data = { error: false, errormessage: "" };
            }
            else {
                status_code = 400;
                response_data = {
                    error: true,
                    errormessage: "Invalid index"
                };
            }
        }
        res.writeHead(status_code, { "Content-Type": "application/json" });
        res.write(JSON.stringify(response_data), "utf-8");
        res.end();
    });
});
server.listen(8080, () => {
    console.log("HTTP Server started on port 8080");
    ostream = fs.createWriteStream('messagelog.txt');
});
console.log("Server setup complete");
//# sourceMappingURL=postmessages.js.map