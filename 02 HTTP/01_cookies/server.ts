/**
 * Example showing how to implement a simple server-side session
 * using cookies.
 * 
 * compile with tsc, and then run it as: 
 * node server.js
 * 
 * To test:
 * open the browser and go to  http://localhost:8080/cookiepage
 * or test manually via telnet (see the README.md)
 * 
 */
import * as http from 'http';
import * as url from 'url';
import * as crypto from 'crypto';

const PORT = 8080;

// In-memory "Database" to track user visits. 
// Keys are the random userids, values are the number of visits.
const sessionStore = new Map<string, number>();


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
            const newUserId = crypto.randomUUID().slice(-4);  // we just keep the last 4 bytes to simplify the manual tests via telnet
            
            // Initialize their visit count in our "database" to 1
            sessionStore.set(newUserId, 1);

            // Send the Set-Cookie header to the browser
            res.writeHead(200, { 
                'Content-Type': 'text/html',
                'Set-Cookie': `userid=${newUserId}; HttpOnly; Path=/` 
            });
            
            res.end(`
                <h1>Hello, ${userName}!</h1>
                <p>We generated a userid for you and saved it in an HttpOnly cookie.</p>
                <p>You have accessed this page <b>1</b> time.</p>
                <a href="/cookiepage">Now visit the page without the query parameter!</a>
            `);
            return;
        }

        // ==========================================
        // ROUTE B: GET /cookiepage (No query args)
        // ==========================================
        if (req.method === 'GET' && !parsedUrl.query.name) {
            
            // Check if they have a cookie AND if that cookie exists in our database
            if (userId && sessionStore.has(userId)) {
                
                // Increment their visit count
                const currentVisits = sessionStore.get(userId)!;
                const newVisits = currentVisits + 1;
                sessionStore.set(userId, newVisits);

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <h1>Welcome back!</h1>
                    <p>Your User ID is: <code>${userId}</code></p>
                    <p>You have accessed this page <b>${newVisits}</b> times.</p>

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
            
            if ( userId in sessionStore ) {
                // Remove them from our server-side database
                sessionStore.delete(userId);
            }

            // Instruct the browser to delete the cookie by setting an expiration date in the past
            res.writeHead(200, { 
                'Content-Type': 'text/plain',
                'Set-Cookie': 'userid=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
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