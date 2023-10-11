var express = require('express');
var router = express.Router();

/* 도서 검색 페이지 */
router.get('/', function(req, res, next) {
  res.render('index', {title:'도서 검색', pageName:'books/search.ejs'})
});

module.exports = router;
