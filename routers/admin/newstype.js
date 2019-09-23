//导入express模块
let express=require('express');
//实例化路由
let router=new express.Router();
//导入文件操作模块
let fs=require('fs');
//引入文件上传模块
let multer=require('multer');
//设置上传文件的临时目录
let upload=multer({dest:"tmp/"});
//导入数据库模块
let pool=require('../../config/pool.js');

//分类的查看页面
router.get('/',(req,res)=>{
	let search=req.query.search?req.query.search:"";
	pool.query("select *from newstype where name like ? order by sort desc",[`%${search}%`],(err,data)=>{
		if(err) throw err;
		if(data.length>0){
			res.render('admin/news/index.html',{data:data,search:search});
		}else{
			res.send('<script>alert("该新闻分类不存在!");history.go(-1);</script>');
		}
	});
});

//分类的添加页面
router.get('/add',(req,res)=>{
	res.render('admin/news/add.html');
});

//分类的添加操作
router.post('/add',(req,res)=>{
	//验证该新闻分类是否已经存在
	let name=req.body.name;
	pool.query("select name from newstype where name=?",[name],(err,data)=>{
		if(err) throw err;
		if(data.length>0){
			res.send('<script>alert("该新闻分类已经存在,请你重新填写!");history.go(-1);</script>');
		}else{
			pool.query("insert into newstype SET ?",[req.body],(err,result)=>{
				//判断为空
				if(err){
					throw err;
				}else{
					console.log(result.affectedRows);
					if(result.affectedRows>0){
						res.send('<script>alert("添加成功!");location.href="/admin/newstype";</script>');
					}else{
						res.send('<script>alert("添加失败!");history.go(-1);</script>');
					}
				}
			});
		}
	});
});

//ajax更改轮播图的顺序
router.get('/ajax_changeSort',(req,res)=>{
	let {id,sort}=req.query;
	console.log(req.query);
	pool.query("update newstype set sort=? where id=?",[sort,id],(err,result)=>{
		if(err){
			return "";
		}else{
			res.send('1');
		}
	});
})

//ajax新闻分类删除操作
router.get('/ajax_del',(req,res)=>{
	let id=req.query.id;
	pool.query("delete from newstype where id=?",[id],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send('1');
		}else{
			res.send('0');
		}
	});
});

//分类的修改页面
router.get('/edit',(req,res)=>{
	//接收传过来的id的值
	let id=req.query.id;
	pool.query("select *from newstype where id=?",[id],(err,data)=>{
		if(err) throw err;
		if(data.length>0){
			res.render('admin/news/edit.html',{data:data[0]});
		}
	});
});

//分类修改的操作
router.post('/edit',(req,res)=>{
	let {id,name,description,keywords,sort}=req.body;
	pool.query("update newstype set name=?,description=?,keywords=?,sort=? where id=?",[name,description,keywords,sort,id],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send('<script>alert("修改成功!");location.href="/admin/newstype/";</script>');
		}
	});
});

module.exports=router;