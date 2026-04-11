/**
 * HTTP Basic Authentication example
 * 
 * compile with tsc, and then run it as: 
 * node server.js
 * 
 * To test:
 * open the browser and go to  http://localhost:8080/privatepage
 * or test manually via telnet (see the README.md)
 * 
 * Note: since Basic authentication is part of the
 * HTTP protocol, credentials can be provided directly
 * in the URL:
 * 
 * http://admin:secret@localhost:8080/privatepage
 * 
 * 
 */
import * as http from 'http';

const PORT = 8080;

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    

    if (req.method === 'GET' && req.url === '/privatepage') {
        
        // get the "authorization" header from the request
        const authHeader = req.headers.authorization;

        // if no header is present, we challenge the client 
        if (!authHeader) {

            res.writeHead(401, { 
                'WWW-Authenticate': 'Basic realm="Restricted Area"',
                'Content-Type': 'text/html' 
            });

            return res.end('<h1>401 Unauthorized</h1><p>You must log in to view this page.</p>');
        }

        // the header is present, and should look like "Basic YWRtaW46c3VwZXJzZWNyZXQ="
        const authParts = authHeader.split(' ');
        const authScheme = authParts[0]; // Should be "Basic"
        const authPayload = authParts[1]; // The base64 string

        // check if the scheme is Basic, if not return an error
        if (authScheme !== 'Basic' || !authPayload) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Bad Request: Invalid Authorization header format.');
        }

        // decode the Base64 string back into plain text
        const decodedCredentials = Buffer.from(authPayload, 'base64').toString('utf8');
        
        // split the decodedCredentials at the ':' character.
        // after Base64 decoding, the credentials should look like this: "username:password"
        const [username, password] = decodedCredentials.split(':');

        console.log(`Received credentials: ${username} / ${password}`);

        // Check if user/password are correct
        if (username === 'admin' && password === 'secret') {

            console.log("Valid credentials!");

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>Private Page</title></head>
                <body>
                    <h1 style="color: green;">Access Granted!</h1>
                    <p>Welcome to the private page, <b>${username}</b>.</p>
                    <p>Your browser automatically attached the Authorization header to get here.</p>
                </body>
                </html>
            `);

        } else {

            console.log("Invalid credentials, challenge the client again.");

            res.writeHead(401, { 
                'WWW-Authenticate': 'Basic realm="Restricted Area"',
                'Content-Type': 'text/html' 
            });

            res.end('<h1>401 Unauthorized</h1><p>Invalid credentials.</p>');
        }
        
    } else {
        // Fallback for all other routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found. Try visiting /privatepage');
    }
});

server.listen(PORT, () => {
    console.log(`Basic Auth Server is running on http://localhost:${PORT}`);
    console.log(`Credentials are admin / secret`);
});