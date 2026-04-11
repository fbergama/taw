# HTTP Basic Authentication demo

Compile with `tsc`, then run `node server.js`

## Testing the webserver

To test it with the browser, open [http://localhost:8080/privatepage](http://localhost:8080/privatepage)

correct credentials are `admin`/`secret`

### Testing with telnet

Run:

```
telnet localhost 8080
```

when requesting `/privatepage` in `GET`, the server will challenge
us to provide the credentials using Basic Authentication:

```
GET /privatepage HTTP/1.1
Host: localhost:8080
```

To encode the string `admin:secret` in base64 you can use the 
JavaScript console in your browser and run:

```
btoa("admin:secret")
```


Finally, the correct request is as follows:


```
GET /privatepage HTTP/1.1
Host: localhost:8080
Authorization: Basic YWRtaW46c2VjcmV0

```
