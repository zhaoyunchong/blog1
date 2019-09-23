//导入express模块
let express=require('express');
//实例化路由
let router=new express.Router();
//导入文件操作模块
let fs=require('fs');
//导入数据库模块
let pool=require('../../config/pool.js');
//导入数据库模块
let multer=require('multer');
//导入文件上传函数
let uploads=require('../../commen/uploads.js');

let upload=multer({dest:"tmp/"});

//声明路由规则

//新闻管理首页
router.get('/',(req,res)=>{
	res.render('admin/new/index.html');
});

//新闻添加界面
router.get('/add',(req,res)=>{
	pool.query("select *from newstype order by sort desc",(err,data)=>{
		if(err){
			throw err;
		}else{
			console.log(data);
			res.render('admin/new/add.html',{data:data});
		}
	});
});

//文章添加操作
router.post('/add',upload.single('img'),(req,res)=>{
	//接受图片上传资源
	let imgRes=req.file;
	//接受表单上传资源
	let {title,keywords,description,info,author,cid,text}=req.body;
	num=0;
	let time=Math.round((new Date().getTime())/100);
	let img=uploads(imgRes,"news");

	//数据插入数据库
	pool.query("insert into news(title,keywords,description,info,author,cid,text,num,time,img) values (?,?,?,?,?,?,?,?,?,?)",[title,keywords,description,info,author,cid,text,num,time,img],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send('<script>alert("添加成功!");location.href="/admin/news";</script>');
		}else{
			res.send('<script>alert("添加失败!");history.go(-1);</script>');
		}
	});
});

//新闻修改首页
router.get('/edit',(req,res)=>{
	res.render('admin/new/edit.html');
});

module.exports=router;