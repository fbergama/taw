Docker examples
---

A super-short tutorial showcasing what Docker can do. I suggest installing
[Docker Desktop](https://www.docker.com/products/docker-desktop/) for a 
simple "batteries included" container runtime.



Preliminary step: remove all the containers:

```
docker container rm -f $(docker container ls -a -q)
```



## Run the hello world

```
docker run hello-world
```


## List all the containers

```
docker container ls -a
```

You should see the hello-world container with status Exited



## Running a container in interactive mode

```
docker run -it ubuntu /bin/bash
```


## Running a container and keep it running in the background

```
docker run -it -d --name myubuntu ubuntu /bin/bash
```

now, if you run

```
docker container ls -a
```

you should see a container named myubuntu up and running.
To stop it, run 

```
docker container stop myubuntu
```

to start it again:

```
docker container start myubuntu
```

## Executing a command inside a running container

```
docker exec -it myubuntu /bin/bash
```


## Mapping ports

```
docker run -d --name nginx -p 8080:80 nginx:alpine
```

now nginx is accessible via port 8080 in the host




Creating Images from containers
---

Let's start a new container from the ubuntu image 

```
docker run -it --name myubuntu ubuntu /bin/bash
```

Create a new file by typing this command inside the container:

```
echo "file di prova" > test.txt
```

Now exit the container. Verify what changed in the container:

```
docker container diff myubuntu
```

Now create a new image from the container filesystem:

```
docker container commit myubuntu myubuntuimage
```

and verify that the new image has been created

```
docker image ls
```

Start a container from myubuntuimage and check if the file is there

```
docker run -it myubuntuimage /bin/bash
```

... just run `ls` inside the running container.



Volumes
---

Create a new volume

```
docker volume create myvolume
```

List all volumes:

```
docker volume ls
```


Run the first container with the volume mounted

```
docker run -it --name myubuntu1 -v mymvolume:/data ubuntu /bin/bash
```

Create a file in `/data` (inside the container):

```
echo "test" > /data/test.txt
```


Run the second container with the same volume mounted

```
docker run -it --name myubuntu2 -v mymvolume:/data ubuntu /bin/bash
```


Bind-mount
---

Create a new directory in the host and add a file

```
mkdir tmp
cd tmp
echo "test test" > test.txt
```


Run a container and bind-mount the directory

```
docker run -it --name myubuntu -v $(pwd)/tmp:/data ubuntu /bin/bash
```


Creating images with Dockerfiles
---

Start by creating a sample Dockerfile in a directory tmp inside the host:

```
mkdir tmp
vim Dockerfile
```


```
from ubuntu:latest
run apt-get update && apt-get install -y fortune
run apt-get clean
cmd ["/usr/games/fortune"]
```



Then build the image

```
docker image build -t fortune .
```

now you can see the fortune image by doing:

```
docker image ls
```

run it!

```
docker run -it --rm fortune
```


Networking
---

Create the `taw` network

```
docker network create taw
```


Start two containers

```
docker run --name c1 -it --rm --network taw alpine:latest /bin/sh
```

```
docker run --name c2 -it --rm --network taw alpine:latest /bin/sh
```


then, from the second container (c2) just run:

```
ping c1
```


