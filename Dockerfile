FROM kkarczmarczyk/node-yarn:6.9
MAINTAINER Mike Engel <mike@mike-engel.com>

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

COPY package.json yarn.lock elm-package.json ${APP_DIR}/

RUN yarn install --production --no-progress \
    && ./node_modules/.bin/elm-package install -y

COPY . ${APP_DIR}/

RUN yarn run compile:elm

EXPOSE ${PORT}

CMD ["npm", "-s", "start"]
