# Minimal web server in Node.js

Compile with `tsc`, then run `node server.js`

## Testing the webserver

To test it with the browser, open [http://localhost:8080/index.html](http://localhost:8080/index.html)

### Testing with telnet

Run:

```
telnet localhost 8080
```

and manually craft the request message. Here are a few examples:

### HTTP 1.0, plain text

```
GET /index.html HTTP/1.0
Accept-Encoding: identity
```

Notes: 

- The connection is dropped just after sending the payload;
- if you perform the same request with `HTTP/1.1`, the server
will complain (status `400`) since the mandatory `Host` header is missing:

```
GET /index.html HTTP/1.1
Accept-Encoding: identity
```


### HTTP 1.0, gzip encoded 

```
GET /index.html HTTP/1.0
Accept-Encoding: gzip
```

### HTTP 1.1, gzip encoded 

```
GET /index.html HTTP/1.1
Host: localhost:8080
Accept-Encoding: gzip
```

Note how the connection is kept alive for a few seconds before timeout.
The `Host` header is mandatory in `HTTP/1.1` to support *Name-Based Virtual Hosting*.

### Get just the headers

```
HEAD /index.html HTTP/1.0
```
