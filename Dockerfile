FROM mhart/alpine-node:6
MAINTAINER Mike Engel <mike@mike-engel.com>

ENV NODE_ENV=production \
    APP_DIR=/app/bkmrkd \
    PORT

RUN mkdir -p ${APP_DIR} \
    && npm config set spin=false \
    && npm install -g npm@latest \
    && npm cache clear

WORKDIR ${APP_DIR}

COPY package.json ${APP_DIR}

RUN npm install --production --no-spin

COPY . ${APP_DIR}

EXPOSE 3000

CMD ["npm", "start"]
