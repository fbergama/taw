# Server-side session management with cookies

Compile with `tsc`, then run `node server.js`

## Testing the webserver

To test it with the browser, open [http://localhost:8080/cookiepage](http://localhost:8080/cookiepage)

### Testing with telnet

Run:

```
telnet localhost 8080
```

and manually craft the request message. Here are a few examples:

### Initial page, without cookies

```
GET /cookiepage HTTP/1.0
Accept-Encoding: identity
```


### Let's identify ourselves

```
GET /cookiepage?name=student HTTP/1.0
Accept-Encoding: identity
```

### Access the initial page again, but sending the received cookie

```
GET /cookiepage HTTP/1.0
Accept-Encoding: identity
Cookie: userid=
```

...and paste the userid you received before.


### delete the session

```
DELETE /cookiepage HTTP/1.0
Accept-Encoding: identity
Cookie: userid=
```