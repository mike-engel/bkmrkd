FROM mhart/alpine-node:6
MAINTAINER Mike Engel <mike@mike-engel.com>
LABEL bkmrkd

ENV NODE_ENV=production \
    APP_DIR=/app/bkmrkd \
    PORT=3000

RUN cd $(npm root -g)/npm \
    && npm i fs-extra \
    && sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js \
    && cd -

RUN mkdir -p ${APP_DIR} \
    && npm config set spin=false \
    && npm install -g npm@latest \
    && npm cache clear

WORKDIR ${APP_DIR}

COPY package.json ${APP_DIR}

RUN npm install --production --no-spin

COPY . ${APP_DIR}

EXPOSE ${PORT}

CMD ["npm", "start"]
