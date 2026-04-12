/**
 * Example showing how to implement a simple client-side session
 * using a JWT stored in a cookie.
 * 
 * compile with tsc, and then run it as: 
 * node server.js
 * 
 * To test:
 * open the browser and go to  http://localhost:8080/cookiepage
 * 
 */
import * as http from 'http';
import * as url from 'url';
import * as jwt from 'jsonwebtoken'; // 1. Import JWT

const PORT = 8080;

// This is the key the server uses to sign the token.
// It MUST remain secret! So, it is not a good idea
// to hardcode it here. We do that just for demonstration
const SECRET_KEY = 'my-super-secret-teaching-key';


// Our sessionStore map is no longer needed since the 
// session data is not stored on the server. The server is now
// completely stateless.
// const sessionStore = new Map<string, number>();


// Helper function to manually parse the raw "Cookie" string from the browser
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    const tokens = cookieHeader.split(';');
    console.log(tokens)
    
    for( let cookie of tokens) {
        const parts = cookie.split('=');
        const name = parts[0]?.trim();
        const value = parts[1]?.trim();
        if (name && value) {
            cookies[name] = value;
        }
    };

    console.log("Cookies parsed: ")
    console.log( cookies )
    
    return cookies;
}



const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    
    const parsedUrl = url.parse(req.url || '', true);
    
    // We only care about the /cookiepage route
    if (parsedUrl.pathname === '/cookiepage') {
        
        // 1. Parse incoming cookies to see if the browser sent a "userid"
        const cookies = parseCookies(req.headers.cookie);
        const userId = cookies['userid'];

        // ==========================================
        // ROUTE A: GET /cookiepage?name=username
        // ==========================================
        if (req.method === 'GET' && parsedUrl.query.name) {
            const userName = parsedUrl.query.name as string;
            
            // Generate a unique ID for this user (simulating a login/session creation)
            //const newUserId = crypto.randomUUID().slice(-4);  // we just keep the last 4 bytes to simplify the manual tests via telnet
            // Initialize their visit count in our "database" to 1
            // sessionStore.set(newUserId, 1);


            // Create the token and sign it
            const payload = { userName: userName, visits: 1 };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });

            // Send the Set-Cookie header to the browser
            res.writeHead(200, { 
                'Content-Type': 'text/html',
                'Set-Cookie': `sessiontoken=${token}; HttpOnly; Path=/` 
            });
            
            res.end(`
                <h1>Hello, ${userName}!</h1>
                <p>We generated a JWT token for you and saved it in an HttpOnly cookie.</p>
                <p>You have accessed this page <b>1</b> time.</p>
                <a href="/cookiepage">Now visit the page without the query parameter!</a>
            `);
            return;
        }

        // ==========================================
        // ROUTE B: GET /cookiepage (No query args)
        // ==========================================
        if (req.method === 'GET' && !parsedUrl.query.name) {

            // get token from the cookie
            const token = cookies['sessiontoken'];
            
            // Check if they have a cookie AND if that cookie exists in our database
            if ( token ) {

                try {
                    const tokenpayload = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

                    // if the token is correct, we create a new token 
                    // with the updated number of visits. Note that we 
                    // cannot simply modify the existing token, we have
                    // to create a new one from scratch and set it again
                    // into a cookie

                    const newtoken = jwt.sign({ userName: tokenpayload.userName, 
                                        visits: tokenpayload.visits + 1 
                                     }, SECRET_KEY, { expiresIn: '1d' });

                    res.writeHead(200, { 
                        'Content-Type': 'text/html',
                        'Set-Cookie': `sessiontoken=${newtoken}; HttpOnly; Path=/` 
                    });

                    res.end(`
                        <h1>Welcome back!</h1>
                        <p>Your username is: <code>${tokenpayload.userName}</code></p>
                        <p>You have accessed this page <b>${tokenpayload.visits + 1}</b> times.</p>

                        <button id="deleteBtn" >Delete My Session</button>

                        <script>
                            document.getElementById('deleteBtn').addEventListener('click', () => {
                                // HTML links can only use GET method which is supposed to be idempotent.
                                // To access /cookiepage in DELETE we need to use JavaScript's fetch API
                                fetch('/cookiepage', { method: 'DELETE' })
                                    .then(response => {
                                        if (response.ok) {
                                            window.location.reload(); 
                                        } else {
                                            alert('Failed to delete session.');
                                        }
                                    });
                            });
                        </script>
                    `);

                } catch (err) {
                    // If the token is fake, altered, or expired, jwt.verify throws an error

                    res.writeHead(401, { 'Content-Type': 'text/html' });
                    res.end('<h1>Token Invalid or Tampered!</h1>');
                }
                
                
            } else {
                // No cookie or session info associated to this user
                res.writeHead(401, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>I don't know you!</h1>
                    <p>Please access <a href="/cookiepage?name=student">/cookiepage?name=student</a> first.</p>
                `);
            }
            return;
        }

        // ==========================================
        // ROUTE C: DELETE /cookiepage
        // ==========================================
        if (req.method === 'DELETE' ) {
            
            // There is nothing to delete on the server!
            // We just ask the browser to delete the cookie holding the token.

            //if ( userId in sessionStore ) {
            //    sessionStore.delete(userId);
            //}

            // Instruct the browser to delete the cookie by setting an expiration date in the past
            res.writeHead(200, { 
                'Content-Type': 'text/plain',
                'Set-Cookie': 'sessiontoken=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
            });
            
            res.end('Cookie successfully deleted and session destroyed.');
            return;
        }
    }

    // Fallback for any other route
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found. Try /cookiepage');
});


server.listen(PORT, () => {
    console.log(`Cookie Server is running on http://localhost:${PORT}`);
});