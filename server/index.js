const apiRouter = require("server/api");
const configServer = require("config/server");
const configMiddleware = require("config/middleware");
const contentRouter = require("server/content");
const express = require("express");
const http = require("http");
const { internalErrorHandler, notFoundHandler } = require("server/errors");
const Raven = require("raven");
const { ravenUrl } = require("config");

const app = express();
const server = http.createServer(app);

configServer(app);
configMiddleware(app);

if (ravenUrl) {
  Raven.config(ravenUrl).install();
  app.use(Raven.requestHandler());
}

app.use(contentRouter);
app.use("/api", apiRouter);
app.use(notFoundHandler);

if (ravenUrl) app.use(Raven.errorHandler());

app.use(internalErrorHandler);

module.exports = {
  app,
  server
};
