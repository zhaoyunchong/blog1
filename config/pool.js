//引入mysql模块
const mysql=require('mysql');
//创建连接池对象
var pool=mysql.createPool({
  host:'127.0.0.1',   //主机地址
  port:3306, 		  //端口号
  user:'root',		  //用户名
  password:'',		  //数据库密码
  database:'blog',	  //数据库名称
  connectionLimit:15  //并发最大连接数
});
//导出连接池对象
module.exports=pool;



