//pm2 start ./pm2-config.json
//pm2 logs 0

var path = require("path"); //path 설정
const express = require("express"); // express 사용 
const session = require("express-session"); // express 세션 사용
const cookieParser = require("cookie-parser"); // 쿠키 사용
const bcrypt = require("bcrypt-nodejs"); // bcrypt-nodejs 사용
const app = express(); //app.use 사용하기 위함
const PORT = 3001; // 포트 번호

app.use('/js', express.static(path.join(__dirname, '/js'))); //js 폴더 경로 설정
app.use('/css', express.static(path.join(__dirname, '/css'))); //css 폴더 경로 설정
app.use('/img', express.static(path.join(__dirname, '/img'))); // img 폴더 경로 설정
app.use(cookieParser()); //cookieParser사용

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); //나는 뷰 엔진으로 ejs를 사용 하겠습니다
app.set('views', path.join(__dirname, 'views')); // views 폴더 위치 잡는거

app.listen(PORT, "0.0.0.0", () => {
    console.log(`server started on PORT ${PORT} // ${new Date()}`);
  }); //요거 해야 서버가 열리더라

  var mysql = require('mysql2');
  const { query } = require('express');
  const connection = mysql.createConnection({
      host: 'ekfkawnl.synology.me',
      user: 'root',
      password: 'root',
      database: 'deg_real',
      port: '49153',
  });
  
  connection.connect();
  
  const mysql2 = require('mysql2/promise');
  const _pool = mysql2.createPool({
      host: 'ekfkawnl.synology.me',
      user: 'root',
      password: 'root',
      database: 'deg_real',
      port: '49153',
      dateStrings: 'date',
      connectionLimit: 10,
      timezone: '+09:00',
  }); // 실운영시 connectionLimit 추가 필요
  async function _getConn() {
      return await _pool.getConnection(async (conn) => conn);
  }
  async function asyncQuery(sql, params = []) {
      const conn = await _getConn();
      try {
          const [rows, _] = await conn.query(sql, params);
          conn.release();
          return rows;
      } catch (err) {
          console.log(`!! asyncQuery Error \n::${err}\n[sql]::${sql}\n[Param]::${params}`);
      } finally {
          conn.release();
      }
      return false;
  }
  
app.get('/', async (req,res) => {
    let arr = await asyncQuery(`select * from example`)
    res.render('index',{arr : arr});
});

app.get('/example', (req,res) => {
    res.render('example');
});

app.get('/input' , async (req,res) => {

    res.render('input')
});