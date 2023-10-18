var express = require('express');
var router = express.Router();
var db = require('../db');

//
router.get('/list.json', function(req, res){
    const bid=req.query.bid;
    const page=parseInt(req.query.page);
    const start=(page-1)*5;
    const sql=`select *, date_format(regdate, "%Y-%m-%d") revdate from review where bid=? order by rid desc limit ?, 5`;
    db.get().query(sql, [bid, start], function(err, rows){
        if(err) console.log("review1 : ", err);
        res.send(rows);
    });
});

//
router.get("/count", function(req, res){
    const bid=req.query.bid;
    const sql=`select count(*) cnt from review where bid=?`;
    db.get().query(sql, [bid], function(err, rows){
        if(err) console.log("review2 : ", err);
        res.send(rows[0].cnt.toString());
    });
});

//리뷰등록
router.post('/insert', function(req, res){
    const bid=req.body.bid;
    const uid=req.body.uid;
    const contents=req.body.contents;
    const sql=`insert into review(bid, uid, contents) values(?, ?, ?)`;
    db.get().query(sql, [bid, uid, contents], function(err, rows){
        if(err) console.log("review3 : ", err);
        res.sendStatus(200);
    })
})

module.exports = router;