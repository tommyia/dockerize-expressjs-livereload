FROM node:dubnium

RUN npm install --global nodemon
WORKDIR /usr/src/app

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json

RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

ADD . /usr/src/app

EXPOSE 3000
CMD ["nodemon", "-L", "/usr/src/app/bin/www"]
