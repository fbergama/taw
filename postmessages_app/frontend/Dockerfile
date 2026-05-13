#
#
# 
FROM node:22-bookworm-slim
LABEL maintainer="Filippo Bergamasco <filippo.bergamasco@unive.it>"

EXPOSE 4200

WORKDIR /app
COPY postmessagesweb /app
RUN npm install -g @angular/cli@18
#RUN npm install

