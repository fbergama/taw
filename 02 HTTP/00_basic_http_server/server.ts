/**
 * Minimal HTTP web server running in Node.js.
 * Supports gzip encoding and content negotiation with
 * the Accept-Encoding header.
 * 
 * compile with tsc, and then run it as: 
 * node server.js
 * 
 * To test:
 * open the browser and go to  http://localhost:8080/index.html
 * or test manually via telnet (see the README.md)
 * 
 */

import * as http from 'http';
import { gzipSync as gzip } from 'zlib';


const PORT = 8080;

const html_page = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Minimal Node Server</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to our Web Technologies class.</p>
</body>
</html>
`

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    
    console.log(`client connected! method: ${req.method}, resource: ${req.url}`);

    if ( (req.method === 'GET') && req.url === '/index.html') {
        console.log("Response: 200 OK");

        const acceptEncoding = req.headers['accept-encoding'] || '';

        
        if (typeof acceptEncoding === 'string' && acceptEncoding.includes('gzip')) {
            // Client accepts gzip encoding
            
            try {
                const compressedBuffer = gzip(html_page);  // compress the payload
                
                res.writeHead(200, { 
                    'Content-Type': 'text/html',
                    'Content-Encoding': 'gzip',
                    'Content-Length': compressedBuffer.byteLength
                });

                res.end(compressedBuffer);
                
            } catch (err) {

                console.error('Compression failed:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }

            
        } else {
            // The client doesn't support gzip, send plain text

            res.writeHead(200, { 
                'Content-Type': 'text/html', 
                // Note: the Content-Length is not just the length of
                // the string since UTF-8 encoding can use multiple
                // bytes for a single character
                'Content-Length': Buffer.from(html_page).byteLength  
            });

            res.end(html_page);
        }
        
        
    } else if ( (req.method === 'HEAD') && req.url === '/index.html') {
        console.log("Response: 200 OK");

        // send just the headers
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': Buffer.from(html_page).byteLength
        })

        // no payload
        res.end();

    } else {

        // Handle all other URLs or methods with a 404 Not Found
        console.log("Response: 404 Not found");
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Resource Not Found');
    }
});


server.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
});