var express = require('express');
var router = express.Router();
var db = require('../db');

//상품 넣기
router.post('/insert', function(req, res){
    const uid=req.body.uid;
    const bid=req.body.bid;
    let sql=`select count(*) cnt from cart where uid=? and bid=?`;
    db.get().query(sql, [uid, bid], function(err, rows){
        if(err) console.log("cart0 : ", err)
        const count=rows[0].cnt;
        if(count==0){ //장바구니에 없으면
            sql=`insert into cart(uid, bid) values(?, ?)`;
            db.get().query(sql, [uid, bid], function(err, rows){
                if(err) console.log("cart1 : ", err);
                res.send('0');
            });
        }else{ //장바구니에 있으면
            sql=`update cart set qnt=qnt+1 where uid=? and bid=?`;
            db.get().query(sql, [uid, bid], function(err, rows){
                if(err) console.log("cart2 : ", err);
                res.send('1');
            });
        }
    });
});

//장바구니 페이지 이동
router.get('/list', function(req, res){
    res.render('index', {title:'장바구니', pageName:'users/cart.ejs'});
});

//장바구니 목록 JSON
router.get('/list.json', function(req, res){ //localhost:3000/cart/list.json?uid=purple
    const uid=req.query.uid;
    const sql=`select *, qnt*price as sum, format(qnt*price, 0) fmtsum from view_cart where uid=?`;
    db.get().query(sql, [uid], function(err, rows){
        if(err) console.log("cart3 : ", err);
        res.send(rows);
    });
});

//장바구니 삭제 버튼
router.post('/delete', function(req, res){
    const cid=req.body.cid;
    const sql=`delete from cart where cid=?`;
    db.get().query(sql, [cid], function(err, rows){
        if(err) console.log("cart4 : ", err);
        res.sendStatus(200);
    });
});

//수량 변경
router.post('/update', function(req, res){
    const cid=req.body.cid;
    const qnt=req.body.qnt;
    const sql=`update cart set qnt=? where cid=?`;
    db.get().query(sql, [qnt, cid], function(err, rows){
        if(err) console.log("cart5 : ", err);
        res.sendStatus(200);
    });
});

module.exports = router;