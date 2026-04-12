# Client-side session management with JWT

This example is based on the server-side cookie example,
but it stores the session data in a JSON Web Token (JWT).

Compile with `tsc`, then run `node server.js`

## Testing the webserver

To test it with the browser, open [http://localhost:8080/cookiepage](http://localhost:8080/cookiepage)


## Main differences

### The server is stateless

You can physically stop and restart the server. If a user refreshes his browser,
he will still be logged in and their visit count will increment! With the
previous Map example, restarting the server wiped all sessions. Here, the state
lives entirely in the browser's cookie.

### Updating session data means generating a new token

In the server-side example, we just did `sessionStore.set(userId, newVisits)`.
With JWT, because the token is a signed string that cannot be modified, we have
to generate a completely new JWT with `visits + 1` and send it back to overwrite
the old cookie.

## The server cannot "delete" the session

Look closely at the DELETE resource. All the server does is tell the browser to
drop the cookie. If an attacker copied that JWT string before it was deleted,
they could still use it to access the server until the token naturally expires. 