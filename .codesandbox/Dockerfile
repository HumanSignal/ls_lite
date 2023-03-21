FROM node:16-slim

RUN apt-get update && \
  apt-get install -y curl python3 python3-pip make g++ bzip2 ca-certificates libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*
  
ENV API_PORT=3001
ENV WEB_PORT=3000
ENV API_URL="http://localhost:${API_PORT}"

COPY . /usr/src/app
WORKDIR /usr/src/app

EXPOSE $WEB_PORT $API_PORT
