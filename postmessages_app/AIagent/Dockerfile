FROM node:22-bookworm-slim
LABEL maintainer="Filippo Bergamasco <filippo.bergamasco@unive.it>"


WORKDIR /app
COPY . /app
RUN npm install
RUN npx tsc
CMD ["node","dist/postmessagesagent.js"]

