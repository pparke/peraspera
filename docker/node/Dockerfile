FROM node:8.1.2

MAINTAINER pparke

# create a user called peraspera and install curl so we can download and
# install yarn
RUN useradd --user-group --create-home --shell /bin/false peraspera &&\
apt-get update && apt-get install -y curl apt-transport-https &&\
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - &&\
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list &&\
apt-get update && apt-get install -y yarn

ENV HOME=/home/peraspera

# copy and make peraspera the owner of package.json since copied files
# are initially owned by root
COPY package.json $HOME/services
RUN chown -R peraspera:peraspera $HOME/*

USER peraspera

WORKDIR $HOME/services

# run yarn to install dependencies
RUN yarn
