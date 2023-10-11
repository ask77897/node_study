var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/list.json', function(req, res, next) {
    var sql = 'select * from users';
    db.get().query(sql, function(err, rows){
        res.send(rows);
    });
});

//사용자목록
router.get('/', function(req,res){
    res.render('index', {title:'사용자 목록', pageName:'users/list.ejs'})
});

//로그인 페이지
router.get('/login', function(req, res){
    res.render('index', {title:'로그인', pageName:'users/login.ejs'})
});

//로그인 체크
router.post('/login', function(req, res){
    const uid=req.body.uid;
    const upass=req.body.upass;
    // console.log(uid, upass);
    let result=0; //유저가 없을 때
    const sql="select * from users where uid=?";
    db.get().query(sql, [uid], function(err, rows){
        // console.log(rows[0]);
        if(rows[0]){
            if(rows[0].upass==upass){
                result=1; //성공
            }else{
                result=2; //비밀번호 불일치
            }
        }
        res.send({result:result});
    });
});

module.exports = router;
