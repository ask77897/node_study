var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');

//업로드 함수
var upload = multer({
  storage:multer.diskStorage({
    destination:(req, file, done) => {
      done(null, './public/upload/photo')
    }, filename:(req, file, done) => {
      var fileName=Date.now() + ".jpg";
      done(null, fileName);
    }
  })
});

/* 사용자 목록 페이지 */
router.get('/', function(req, res, next) {
  res.render('index', {title:'사용자 목록', pageName:'users/list.ejs'})
});

//사용자 목록 JSON
router.get('/list.json', function(req, res){
  const sql='select * from users order by uname';
  db.get().query(sql, function(err, rows){
    res.send(rows);
  });
});

//로그인 페이지
router.get('/login', function(req, res){
  res.render('index', {title:'로그인', pageName:'users/login.ejs'})
});

//로그인 체크
router.post('/login', function(req, res){
  const uid=req.body.uid;
  const upass=req.body.upass;
  const sql='select * from users where uid=?'
  db.get().query(sql, [uid], function(err, rows){
    let result='0';
    if(rows[0]){
      if(rows[0].upass==upass){
        result='1';
      }else{
        result='2';
      }
    }
    res.send(result);
  });
});

//회원가입 페이지
router.get('/insert', function(req, res){
  res.render('index', {title:'회원가입', pageName:'users/insert.ejs'})
});
//회원가입 내용 저장
router.post('/insert', function(req, res){
  const uid=req.body.uid;
  const upass=req.body.upass;
  const uname=req.body.uname;
  const phone=req.body.phone;
  const address1=req.body.address1;
  const address2=req.body.address2;
  console.log(uid, upass, uname, phone, address1, address2);
  const sql='insert into users(uid, upass, uname, phone, address1, address2) values(?, ?, ?, ?, ?, ?)';
  db.get().query(sql, [uid, upass, uname, phone, address1, address2], function(err, rows){
    res.redirect('/users/login');
  })
})

//마이페이지 이동
router.get('/mypage', function(req, res){
  const uid=req.query.uid;
  const sql='select * from users where uid=?';
  db.get().query(sql, [uid], function(err, rows){
    //console.log(uid, rows[0]);
    res.render('index', {title:'마이페이지', pageName:'users/mypage.ejs', user:rows[0]});
  });
});

//정보수정 페이지
router.get('/update', function(req, res){
  const uid=req.query.uid;
  const sql='select * from users where uid=?';
  db.get().query(sql, [uid], function(err, rows){
    //console.log(uid, rows[0]);
    res.render('index', {title:'정보수정', pageName:'users/update.ejs', user:rows[0]});
  });
});

//수정된 정보 저장
router.post('/update', upload.single('file'), function(req, res){
  const uid=req.body.uid;
  const uname=req.body.uname;
  const phone=req.body.phone;
  const address1=req.body.address1;
  const address2=req.body.address2;
  let photo=req.body.photo;
  if(req.file) photo=req.file.filename;
  const sql='update users set uname=?, phone=?, address1=?, address2=?, photo=? where uid=?';
  db.get().query(sql, [uname, phone, address1, address2, photo, uid], function(err, rows){
    if(err) console.log(err);
    res.redirect('/users/mypage?uid='+uid);
    // res.sendStatus(200); ajax로 했을 때
  });
});

//비밀번호 변경 페이지
router.get('/change', function(req, res){
  res.render('index', {title:'비밀번호 변경', pageName:'users/change.ejs'})
});
//비밀번호 변경된거 저장
router.post('/change', function(req, res){
  const uid=req.body.uid;
  const upass=req.body.npass;
  const sql='update users set upass=? where uid=?';
  db.get().query(sql, [upass, uid], function(err, rows){
    if(err) console.log(err);
    //res.redirect('/users/login');
    res.sendStatus(200);
  });
});

module.exports = router;
