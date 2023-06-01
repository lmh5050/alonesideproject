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
      port: '49153',
  });
  
  connection.connect();
  
  const mysql2 = require('mysql2/promise');
  const _pool = mysql2.createPool({
      host: 'ekfkawnl.synology.me',
      user: 'root',
      password: 'root',
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
                                FROM erp_dg.customer_info`)
    res.render('management_customer',{row : row});
}); 

app.get('/management_customer', async (req,res) => {
    let row = await asyncQuery(`SELECT code,
                                        company,
                                        ceo,
                                        tel,
                                        ect_tel,
                                        fax,                    
                                        address
                                FROM erp_dg.customer_info`)
    res.render('management_customer',{row : row});
}); 

app.get('/management_customer_detail/:process/:value', async (req, res) => {
	
	let process = req.params.process;
	let value = req.params.value;
	
	let sql = 'SELECT a.no, a.code, a.division , a.company , a.nickname , a.ceo , a.tel , a.cost , a.ect_tel , a.fax , a.reg_no , DATE_FORMAT(reg_date, "%Y-%m-%d") as reg_date, a.occupation , a.event , a.address , a.charge , a.ect , a.updatetime  from erp_dg.customer_info a	';										   
	let where_add = '';							
	let order_by_add = ' ORDER BY (no) DESC';		
	
	if(process==1){
		where_add = " where a.code like '%" + value + "%'";
	}else if(process==2){
		where_add = " where a.nickname like '%" + value + "%'";		
	}else if(process==3){		
		where_add = " where a.company like '%" + value + "%'";		
	}else if(process==4){		
		where_add = " where a.ceo like '%" + value + "%'";		
	}else if(process==5){		
		where_add = " where a.tel like '%" + value + "%'";		
	}else if(process==6){		
		where_add = " where a.division like '%" + value + "%'";		
	}		
	let sql2 = sql + where_add + order_by_add;
	
	let row = await asyncQuery(sql2);
	
	
	res.render('management_customer_detail',{row:row,process:process,value:value});
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
                                                 FROM erp_dg.customer_info
                                                 WHERE code ='${req.body.code}'`)                                     
res.send({customer_search_row: customer_search_row});
});

app.post("/customer_save", async (req, res) => {
    console.log(req.body.code)
    let check_code = await asyncQuery(`SELECT code FROM erp_dg.customer_info WHERE code = '${req.body.code}'`)
    console.log(check_code.length)
    if (check_code.length >= 1)
    {
        res.send('n');
    }
    else
    {
    let customer_save_row = await asyncQuery(`INSERT INTO erp_dg.customer_info (code,
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
}
});

app.post("/modify_save", async (req, res) => {
    console.log(req.body)
    let customer_save_row = await asyncQuery(`UPDATE erp_dg.customer_info 
                                              SET code = '${req.body.code}',
                                                   division = '${req.body.division}',
                                                   company = '${req.body.nickname}',
                                                   nickname = '${req.body.company}',
                                                   ceo = '${req.body.ceo}',
                                                   tel = '${req.body.tel}',
                                                   cost = '${req.body.cost}',
                                                   ect_tel = '${req.body.ect_tel}',
                                                   fax = '${req.body.fax}',
                                                   reg_no = '${req.body.reg_no}',
                                                   reg_date = '${req.body.reg_date}',
                                                   occupation = '${req.body.occupation}',
                                                   event = '${req.body.event}',
                                                   address = '${req.body.address}',
                                                   charge = '${req.body.charge}',
                                                   ect = '${req.body.ect}'
                                                WHERE code = '${req.body.code}'`
                                                )
res.send('y');
});

app.post('/customer_info_delete', async (req, res) => {
	console.log(req.body)
    if (req.body.chList) {
		const sParm =
			typeof req.body.chList == 'string' ? req.body.chList : req.body.chList.join(',');
		
		if (sParm != '') {
			if ((await asyncQuery(`DELETE FROM customer_info WHERE no IN (${sParm})`))) {
				res.send(`<script>alert('삭제가 완료 되었습니다.'); location='/management_customer';</script>`);				
			} else {
				return res.send(`<script>alert('삭제 실패'); location='/management_customer';</script>`);
			}
		} else {
			res.send(
				`<script>alert(' 내역이 존재하여 삭제할 수 없습니다.'); location='/management_customer';</script>`
			);
		}
	}
	res.send(`<script>alert('체크박스를 선택해주세요.'); location='/management_customer';</script>`);			
});
/*  
app.get('/', async (req,res) => {
    let arr = await asyncQuery(`select * from example`)
    res.render('index',{arr : arr});
});
*/
app.get('/example', (req,res) => {
    res.render('example');
});

app.get('/exam1', (req,res) => {
    res.render('exam1');
});

app.get('/input' , async (req,res) => {

    res.render('input')
});

app.get('/input_ex' , async (req,res) => {
    let row = await asyncQuery(`SELECT no,
                                       id,
                                       pass,
                                       name,
                                       sosok,
                                       score,
                                       grade
                                 FROM test.example `)
    console.log(row)
    res.render('input_ex',{row:row})
});