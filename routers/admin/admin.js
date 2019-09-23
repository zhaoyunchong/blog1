//引入express模块
let express=require('express');
//实例化路由类
let router=express.Router();
//导入数据库对象
let pool=require('../../config/pool.js');
//导入md5加密文件
const crypto=require('crypto');
//导入moment模块
const moment=require('moment');//时间的处理模块

//管理员首页
router.get('/',(req,res)=>{
	//获取地址栏参数 req.query
	//获取表单参数 req.body
	let search=req.query.search?req.query.search:"";//三目运算符 如果为空的话则赋值为空字符串

	pool.query("select *from admin where username like ? order by id desc",[`%${search}%`],(err,data)=>{
		if(err) throw err;
		if(data.length>0){
			data.forEach(item=>{
				//Y代表年份  MM代表月份 DD代表日份 HH代表小时  mm代表分钟 ss代表秒数
				item.time=moment(item.time*1000).format("YYYY-MM-DD HH-mm-ss");//格式化时间
			});
			res.render('admin/admin/index.html',{data:data,search:search});
		}else{
			res.send("<script>alert('此用户不存在!');history.go(-1);</script>");
		}
	});
});

//管理员状态修改
router.get('/ajax_status',(req,res)=>{
	let {id,status}=req.query;
	pool.query("update admin set status=? where id=?",[status,id],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});

//管理员删除操作
router.get('/ajax_del',(req,res)=>{
	let id=req.query.id;
	pool.query("delete from admin where id=?",[id],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send('1');
		}else{
			res.send('0');
		}
	});
});


//管理员添加界面
router.get('/add',(req,res)=>{
	res.render('admin/admin/add.html');
});
//管理员添加操作
router.post('/add',(req,res)=>{
	//接受数据
	let {username,password,repassword,status}=req.body;
	//验证数据
	if(!username){
		res.send("<script>alert('请输入账户名!');hostory.go(-1);</script>");
	}else{
		if(username.length>=6&&username.length<=12){
			if(password){
				if(password==repassword){
					let sql="select *from admin where username=?";
					pool.query(sql,[username],(err,result)=>{
						if(err) throw err;
						//判断用户名是否已经注册
						if(result.length==0){
							let time=Math.round((new Date().getTime())/1000);//Date().getTime 获取时间戳的毫秒数  存到数据库的时候应该是秒数 
							let md5=crypto.createHash('md5');//创建md5加密规则
							password=md5.update(password).digest('hex');
							pool.query("insert into admin(username,password,status,time)values(?,?,?,?)",[username,password,status,time],(err,result)=>{
								if(err) throw err;
								if(result.affectedRows>0){
									res.send("<script>alert('添加成功!');location.href='/admin/admin';</script>");
								}else{
									res.send("<script>alert('添加失败!');history.go(-1);</script>");
								}
							});
						}else{
							res.send("<script>alert('账户名已经被注册,请重新输入!');history.go(-1);</script>");
						}
					});
				}else{
					res.send("<script>alert('两次密码不一致!');history.go(-1);</script>");
				}
			}else{
				res.send("<script>alert('请输入密码!');history.go(-1);</script>");
			}
		}else{
			res.send("<script>alert('用户名长度6到12位之间!');history.go(-1);</script>");
		}
	}
});

//管理员修改页面
router.get('/edit',(req,res)=>{
	let id=req.query.id;
	pool.query("select *from admin where id=?",[id],(err,data)=>{
		if(err) throw err;
		if(data.length>0){
			res.render('admin/admin/edit.html',{data:data[0]});
		}
	});
});

//管理员修改操作
router.post('/edit',(req,res)=>{
	let {username,password,newpassword}=req.body;
	if(password==''){
		res.send("<script>alert('请输入旧密码!');history.go(-1);</script>");
	}else if(newpassword==''){
		res.send("<script>alert('请输入新密码!');history.go(-1);</script>");
	}

	pool.query("select *from admin where username=?",[username],(err,data)=>{
		if(err) throw err;
		let hex=crypto.createHash('md5');//创建md5加密规则
		password=hex.update(password).digest('hex');
		console.log(password);
		console.log(data[0].passowrd);
		if(password!=data[0].password){
			res.send("<script>alert('旧密码不正确,请重新输入!');history.go(-1);</script>");
		}else{
			let md5=crypto.createHash('md5');
			newpassword=md5.update(newpassword).digest('hex');
			pool.query("update admin set password=? where username =?",[newpassword,username],(err,result)=>{
				if(err) throw err;
				if(result.affectedRows>0){
					res.send("<script>alert('修改成功!');location.href='/admin/admin';</script>");
				}else{
					res.send("<script>alert('修改失败!');history.go(-1);</script>");
				}
			});
		}
		
	});

});

module.exports=router;