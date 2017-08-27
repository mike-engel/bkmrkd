FROM node:8-alpine
MAINTAINER Mike Engel <mike@mike-engel.com>

ENV NODE_ENV=production \
    APP_DIR=/app/bkmrkd \
    PORT=3000

RUN mkdir -p ${APP_DIR} \
    && npm config set spin=false

WORKDIR ${APP_DIR}

COPY package.json package-lock.json elm-package.json ${APP_DIR}/

RUN npm install --production --no-progress

COPY . ${APP_DIR}/

EXPOSE ${PORT}

CMD ["npm", "-s", "start"]
