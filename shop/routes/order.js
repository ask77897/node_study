var express = require('express');
var router = express.Router();
var db = require('../db');

//주문 등록 페이지 이동
router.get("/insert", function(req, res){
    const cart=req.query.cart;
    //console.log(cart);
    res.render('index', {title:'주문하기', pageName:'users/order.ejs', cart:cart});
});

//주문할 도서목록
router.get('/cart.json', function(req, res){
    const cart=req.query.cart;
    const uid=req.query.uid;
    let sql=`select * from view_cart where cid in (${cart})`; //주문 도서 목록
    db.get().query(sql, function(err, rows){
        if(err) console.log("order1 : ", err);
        //res.send(rows);
        const order=rows;
        sql=`select * from users where uid=?`; //주문자 정보
        db.get().query(sql, [uid], function(err, rows){
            if(err) console.log("order2 : ", err);
            res.send({order, user:rows[0]})
        });
    });
});

//주문자 정보 입력
router.post("/purchase/insert", function(req, res){
    const uid=req.body.uid;
    const rname=req.body.rname;
    const rphone=req.body.rphone;
    const raddress1=req.body.raddress1;
    const raddress2=req.body.raddress2;
    const sum=req.body.sum;
    let sql=`insert into purchase(uid, rname, rphone, raddress1, raddress2, sum) values(?, ?, ?, ?, ?, ?)`;
    db.get().query(sql, [uid, rname, rphone, raddress1, raddress2, sum], function(err, rows){
        if(err) console.log("order3 : ", err);
        sql=`select last_insert_id() last`;
        db.get().query(sql, function(err, rows){
            if(err) console.log("order4 : ", err);
            res.send(rows[0].last.toString());
        });
    });
});

//주문상품 등록
router.post('/book/insert', function(req, res){
    const pid=req.body.pid;
    const bid=req.body.bid;
    const qnt=req.body.qnt;
    const price=req.body.price;
    const cid=req.body.cid;
    //console.log(pid, bid, qnt, price, cid);
    let sql=`insert into orders(pid, bid, qnt, price) values(?, ?, ?, ?)`;
    db.get().query(sql, [pid, bid, qnt, price], function(err, rows){
        if(err) console.log("order5 : ", err);
        sql=`delete from cart where cid=?`;
        db.get().query(sql, [cid], function(err, rows){
            if(err) console.log("order6 : ", err);
            res.sendStatus(200);
        });
    });
});

//주문목록 페이지 이동
router.get('/', function(req, res){
    res.render('index', {title:'주문목록', pageName:'order/list.ejs'});
});

//주문목록 JSON
router.get("/list.json", function(req, res){ //localhost:3000/order/list.json?uid=
    const uid=req.query.uid;
    const sql=`select * from view_purchase where uid=?`;
    db.get().query(sql, [uid], function(err, rows){
        if(err) console.log("order7 : ", err);
        res.send(rows);
    });
});

//주문상품목록 JSON
router.get("/book.json", function(req, res){ //localhost:3000/order/book.json?pid=
    const pid=req.query.pid;
    let sql=`select * from view_orders where pid=?`;
    db.get().query(sql, [pid], function(err, rows){
        if(err) console.log("order8 : ", err);
        const books=rows
        sql=`select * from view_purchase where pid=?`
        db.get().query(sql, [pid], function(err, rows){
            if(err) console.log("order9 : ", err);
            res.send({books, info:rows[0]});
        });
    });
});

//주문관리 페이지 이동
router.get('/admin', function(req, res){
    res.render('index', {title:'주문관리', pageName:'order/admin.ejs'});
});

//주문관리 JSON
router.get('/admin.json', function(req, res){ //localhost:3000/order/admin.json?page=1
    const page=req.query.page;
    const start=(parseInt(page)-1)*3;
    const status=req.query.status;
    let sql='';
    if(status=='100'){ //모든 구매 상황
        sql=`select * from view_purchase limit ?, 3`;
    }else{ //status에 해당하는 구매 상황
        sql=`select * from view_purchase where status=${status} limit ?, 3`;
    }
    db.get().query(sql, [start], function(err, rows){
        if(err) console.log("order10 : ", err);
        res.send(rows);
    });
});

//주문 갯수
router.get('/count', function(req, res){ //localhost:3000/order/count
    let sql='';
    const status=req.query.status;
    if(status=='100'){
        sql=`select count(*) cnt from view_purchase`;
    }else{
        sql=`select count(*) cnt from view_purchase where status=${status}`;
    }
    db.get().query(sql, function(err, rows){
        if(err) console.log("order11 : ", err);
        res.send(rows[0].cnt.toString());
    });
});

//주문 상태 변경
router.post('/status/update', function(req, res){
    const pid=req.body.pid;
    const status=req.body.status;
    const sql=`update purchase set status=? where pid=?`;
    db.get().query(sql, [status, pid], function(err, rows){
        if(err) console.log("order12 : ", err);
        res.sendStatus(200);
    })
});

module.exports = router;