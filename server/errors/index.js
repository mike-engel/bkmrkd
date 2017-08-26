const { env } = require("config");
const { log } = require("server/utils");

const internalErrorHandler = (err, req, res, next) => {
  log.error(err);

  return res.status(500).json({
    message: err.message,
    error: err
  });
};

const notFoundHandler = (req, res) => {
  return res.status(404).render("index", {
    env
  });
};

module.exports = {
  internalErrorHandler,
  notFoundHandler
};
