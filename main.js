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
app.use("/vendor", express.static(path.join(__dirname, "/vendor")));//vendor 폴더 경로 설정
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
    let row = await asyncQuery(`SELECT code,
                                        company,
                                        ceo,
                                        tel,
                                        ect_tel,
                                        fax,                    
                                        address
                                FROM customer_info`)
    res.render('management_customer',{row : row});
}); 

app.post("/customer_search", async (req, res) => {
    let customer_search_row = await asyncQuery(`SELECT code,
                                                        division,
                                                        company,
                                                        nickname,
                                                        ceo,
                                                        tel,
                                                        cost,
                                                        ect_tel,
                                                        fax,
                                                        reg_no,
                                                        DATE_FORMAT(reg_date, '%Y-%m-%d') AS reg_date,
                                                        occupation,
                                                        event,
                                                        address,
                                                        charge,
                                                        ect
                                                 FROM customer_info
                                                 WHERE code ='${req.body.code}'`)                                     
res.send({customer_search_row: customer_search_row});
});

app.post("/customer_save", async (req, res) => {
    let customer_save_row = await asyncQuery(`INSERT INTO customer_info (code,
                                                                         division,
                                                                         company,
                                                                         nickname,
                                                                         ceo,
                                                                         tel,
                                                                         cost,
                                                                         ect_tel,
                                                                         fax,
                                                                         reg_no,
                                                                         reg_date,
                                                                         occupation,
                                                                         event,
                                                                         address,
                                                                         charge,
                                                                         ect)
                                                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                                                [
                                                  req.body.code,
                                                  req.body.division,
                                                  req.body.nickname,
                                                  req.body.company,
                                                  req.body.ceo,
                                                  req.body.tel,
                                                  req.body.cost,
                                                  req.body.ect_tel,
                                                  req.body.fax,
                                                  req.body.reg_no,
                                                  req.body.reg_date,
                                                  req.body.occupation,
                                                  req.body.event,
                                                  req.body.address,
                                                  req.body.charge,
                                                  req.body.ect
                                                ])
res.send('y');
});

app.post("/modify_save", async (req, res) => {
    console.log(req.body)
    let customer_save_row = await asyncQuery(`UPDATE customer_info 
                                              SET (code = ?,
                                                   division = ?,
                                                   company = ?,
                                                   nickname = ?,
                                                   ceo = ?,
                                                   tel = ?,
                                                   cost = ?,
                                                   ect_tel = ?,
                                                   fax = ?,
                                                   reg_no = ?,
                                                   reg_date = ?,
                                                   occupation = ?,
                                                   event = ?,
                                                   address = ?,
                                                   charge = ?,
                                                   ect = ?)
                                                WHERE code = '${req.body.code}'`,
                                                [
                                                  req.body.code,
                                                  req.body.division,
                                                  req.body.nickname,
                                                  req.body.company,
                                                  req.body.ceo,
                                                  req.body.tel,
                                                  req.body.cost,
                                                  req.body.ect_tel,
                                                  req.body.fax,
                                                  req.body.reg_no,
                                                  req.body.reg_date,
                                                  req.body.occupation,
                                                  req.body.event,
                                                  req.body.address,
                                                  req.body.charge,
                                                  req.body.ect
                                                ])
res.send('y');
});
/*
app.post("/laiser_select", async (req, res) => {
	 let selected_row_wait = await asyncQuery(`SELECT b.no,
											   b.file_name,
											   b.key_no,
											   a.shipping_date,
											   a.work_no,
											   b.quality,
											   b.thickness,
											   b.materials_max,
											   a.status 
										FROM     tech_in.process as a
										LEFT JOIN	tech_in.operation as b
										ON a.key_no  = b.key_no 
										WHERE a.key_no = '${req.body.key_no}' and a.status = 10
				   `)
	  let selected_row_ing = await asyncQuery(`SELECT b.no,
											   b.file_name,
											   b.key_no,
											   a.shipping_date,
											   a.work_no,
											   b.quality,
											   b.thickness,
											   b.materials_max,
											   a.status 
										FROM     tech_in.process as a
										LEFT JOIN	tech_in.operation as b
										ON a.key_no  = b.key_no 
										WHERE a.key_no = '${req.body.key_no}' and a.status = 11
				   `)
	
res.send({
        selected_row_wait: selected_row_wait,
        selected_row_ing: selected_row_ing
    });
});
*/
/*  
app.get('/', async (req,res) => {
    let arr = await asyncQuery(`select * from example`)
    res.render('index',{arr : arr});
});
*/
app.get('/example', (req,res) => {
    res.render('example');
});

app.get('/input' , async (req,res) => {

    res.render('input')
});