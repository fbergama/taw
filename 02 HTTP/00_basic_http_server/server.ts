import * as http from 'http';

const PORT = 8080;

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    

    if (req.method === 'GET' && req.url === '/index.html') {
        
        // 1. Set the HTTP status code and headers
        res.writeHead(200, { 'Content-Type': 'text/html' });
        
        // 2. Send the minimal HTML payload and end the response
        res.end(`
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
        `);
        
    } else {
        // Handle all other routes or methods with a 404 Not Found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Resource Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
});