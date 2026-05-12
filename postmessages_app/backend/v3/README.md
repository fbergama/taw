Postmessages application full backend (v3)
---

This backend combines MongoDB and Express, and implements user
management. 

How to run it via Docker:

1. Create a new network

```
docker network create taw
```


2. Start a MongoDB container 

```
docker run --network taw --name mymongo -d mongo:6
```


3. Open VSC and reopen this directory in container


4. Open the terminal and run

```
npm install
npx tsc 
```

5. Run the application

```
node postmessages
```


Optional:
---

To inspect the database with mongo shell:

```
docker run -it --name mongodbshell --network taw --rm mongo:6 mongosh --host mymongo
```

Then, inside the shell:

```
use postmessages;
show collections;
```

to delete all the data:

```
db.users.deleteMany( {} )
db.messages.deleteMany( {} )
```
