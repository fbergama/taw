#
# Open this directory in VSC, click on the bottom left icon `><` and select "Reopen in Container".
#
# Official Node.js images in Docker Hub:
#  https://hub.docker.com/_/node
#
# Alternatively, build the image:
# docker image build -t myapp .
#
# And then spawn a container:
# docker run myapp

FROM node:25-trixie-slim
LABEL maintainer="Filippo Bergamasco <filippo.bergamasco@unive.it>"

WORKDIR /app
COPY . /app

CMD ["node", "helloworld.js"]
