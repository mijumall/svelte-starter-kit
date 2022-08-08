FROM ubuntu:22.04
SHELL ["/bin/bash", "-c"]

ENV DEBIAN_FRONTEND=noninteractive
ENV workspace /space
ENV nodejs_installer nodejs.tar.xz

WORKDIR $workspace
RUN apt update && apt full-upgrade -y && apt install -y vim less curl xz-utils

COPY $nodejs_installer $workspace/

RUN tar -xf $nodejs_installer && rm $nodejs_installer && mv node-v* nodejs
ENV PATH=$PATH:$workspace/nodejs/bin

RUN npm install -g sass typescript vite
RUN npm init vite app -- --template svelte-ts

WORKDIR $workspace/app

RUN npm install && npm install -D sass

ENV DEBIAN_FRONTEND=dialog

CMD ["npm", "--help"]
