const render = require('./render');

module.exports = function(opts) {
  return function(req, res, next) {
    res.render = function(html) {
      res.setHeader('Content-Type', 'text/html');
      res.end(render(html, opts));
    };
    next();
  };
};
