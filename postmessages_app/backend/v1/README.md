
##  Simple HTTP REST server
 
Post and get simple text messages. Each message has a text content, a list of tags
and an associated timestamp


```
Endpoints          Attributes          Method        Description

    /                  -                  GET         Returns the version and a list of available endpoints
    /messages          -                  GET         Returns all the posted messages
    /messages          -                  POST        Post a new message
    /messages        ?index=<n>           DELETE      Delete the n^th message

```

Note: all the endpoints are prefixed with `/api/v1/`


## Install and run

To install the required modules:

```
$ npm install
```

To compile:

```
$ npm run compile
```

or

```
$ npx tsc
```

To run:

```
$ node postmessages
```

## API documentation

APIs are documented in `openapi.yaml` using the [openapi specification](https://spec.openapis.org/oas/latest.html#openapi-specification) in YAML format. 

You can generate an HTML documentation by running:

```
npm run doc
```


## Testing

Install [Postman](https://www.postman.com/downloads/), and then import `WebTech-http.postman_collection.json`