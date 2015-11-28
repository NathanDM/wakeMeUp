
module.exports = function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('blank-page.html', {
    message: err.message,
    error: {}
  });
};
