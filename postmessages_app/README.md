# Postmessages MEAN-stack application

This is a simple demo application to let users post and read short text
messages with some associated tags. It is built on top of a classic MEAN stack
(Mongo, Express, Angular, Node.js), and is composed of:

1. A TypeScript/Node.js backend, exposing RESTful APIs via HTTP
2. An Angular-based frontend
3. Optional: An AI agent that automatically posts messages simulating realistic users


## How to run it via docker-composer


### Build the containers


```
docker compose build --no-cache
```


### Run

Different profiles can be enabled depending on which containers you want to run.
To start everything (backend, frontend, AIagent and the required MongoDB):

```
docker compose --profile ai --profile frontend up
```

Removing the `--profile ai` or `--profile frontend` allows you to skip the
AI agent or the frontend respectively.

The frontend is accessible at [http://localhost:4200](http://localhost:4200).

## AI Agent requirement

The AI agent requires [ollama](https://ollama.com/) running on the host machine
and accessible on port `11434`.


## Maintenance

Database can be inspected with mongodbshell:

```
docker run -it --name mongodbshell --network taw --rm mongo:6 mongosh --host mymongo
```

to clean all messages:

```
use postmessages;
db.messages.deleteMany({});
```
