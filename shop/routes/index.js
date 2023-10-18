var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '홈페이지', pageName:'home.ejs' });
});
//지역 검색 페이지
router.get('/search', function(req, res){
  res.render('index', {title:'지역검색', pageName:'local/search.ejs'});
});
//도서목록 JSON
router.get('/books.json', function(req, res){
  const page=parseInt(req.query.page);
  const query=`%${req.query.query}%`;
  const uid=req.query.uid;
  // console.log(query);
  // console.log(page);
  const start=(page-1)*6
  let sql=`select *, `;
  sql += `(select count(*) from favorite where bid=books.bid) fcnt, `;
  sql += `(select count(*) from favorite where bid=books.bid and uid=?) ucnt `;
  sql += `from books where title like ? or authors like ? order by bid desc limit ?,6`;
  db.get().query(sql, [uid, query, query, start], function(err, rows){
    if(err) console.log("index1 : ", err);
    res.send(rows);
  });
});
//도서 갯수 출력
router.get('/count', function(req, res){
  const query=`%${req.query.query}%`;
  const sql=`select count(*) total from books where title like ? or authors like ?`;
  db.get().query(sql, [query, query], function(err, rows){
    if(err) console.log("index2 : ", err);
    res.send(rows[0].total.toString());
  });
});

module.exports = router;
