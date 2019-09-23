//导入express模块
let express=require('express');
//实例化路由
let router=new express.Router();
//导入文件上传模块
let multer=require('multer');
//引入path模块
let path=require('path');
//导入fs文件模块
let fs=require('fs');
//导入数据库文件
let pool=require('../../config/pool.js');
//导入封装的图片上传函数
let uploads=require('../../commen/uploads.js');
//设置临时目录 存放上传的图片
const upload=multer({dest:"tmp/"});
//轮播图管理路由

//首页界面
router.get('/',(req,res,next)=>{
	//查找数据库中的数据
	pool.query("select *from banner order by id desc",(err,data)=>{
		if(err){
			return false;
		}else{
			console.log(data);
			//加载页面
			res.render('admin/slider/index.html',{data:data});
		}
	});
});

//添加轮播图界面
router.get('/add',(req,res)=>{
	//加载页面
	res.render("admin/slider/add.html");
});

//添加轮播图操作
router.post('/add',upload.single("img"),(req,res)=>{
	//接受前台表单传过来的东西 
	let {name,url,sort}=req.body;
	//接受图片上传传过来
	let imgRes=req.file;
	//获取上传的临时文件
	let tmpPath=imgRes.path;
	//获取文件名的后缀
	let ext=path.extname(imgRes.originalname);
	//给文件重新命名
	let newName=""+(new Date().getTime())+Math.round(Math.random()*10000)+ext;
	//设置文件的存放目录
	let newPath="/upload/slider/"+newName;
	//进行文件拷贝,同步读取数据
	let fileData=fs.readFileSync(tmpPath);
	//同步写入文件
	fs.writeFileSync(__dirname+'/../../'+newPath,fileData);
	pool.query("insert into banner(name,url,sort,img) values (?,?,?,?)",[name,url,sort,newPath],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send('<script>alert("添加成功!");location.href="/admin/slider";</script>');
		}else{
			res.send('<script>alert("添加成功!");history.go(-1);</script>');
		}
	});

});

//ajax删除图片操作
router.get('/ajax_del',(req,res,next)=>{
	let {id,img}=req.query;
	pool.query("delete from banner where id=?",[id],(err,result)=>{
		if(err){
			return "";
		}
		if(result.affectedRows>0){
			if(fs.existsSync(__dirname+"/../../"+img)){
				fs.unlinkSync(__dirname+"/../../"+img);
			}
			res.send("1");
		}else{
			res.send('0');	
		}
	})
});

//ajax更改轮播图的顺序
router.get('/ajax_changeSort',(req,res)=>{
	let {id,sort}=req.query;
	pool.query("update banner set sort=? where id=?",[sort,id],(err,result)=>{
		if(err){
			return "";
		}else{
			res.send('1');
		}
	});
})

//轮播图修改界面
router.get('/edit',(req,res)=>{
	let id=req.query.id;
	pool.query("select *from banner where id=?",[id],(err,data)=>{
		if(err){
			return "";
		}else{
			res.render('admin/slider/edit.html',{data:data[0]});
		}
	});
});

//轮播图修改操作
router.post('/edit',upload.single('img'),(req,res)=>{
	//接受图片资源
	let imgRes=req.file;
	//接受表单数据
	let {id,name,url,sort,oldimg}=req.body;
	console.log(oldimg);
	let sql="";
	let arr=[];
	//判断图片资源是否存在,看看用户是否修改图片
	if(imgRes){

		let img=uploads(imgRes,"slider");
		arr=[name,url,sort,img,id];
		sql="update banner set name=?,url=?,sort=?,img=? where id=?";
	}else{
		arr=[name,url,sort,id];
		sql="update banner set name=?,url=?,sort=? where id=?";
	}
	pool.query(sql,arr,(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			if(imgRes){
				if(fs.existsSync(__dirname+"/../../"+oldimg)){
					fs.unlinkSync(__dirname+"/../../"+oldimg);
				}
			}
			res.send('<script>alert("修改成功!");location.href="/admin/slider";</script>');
		}else{
			res.send('<script>alert("修改失败!");hostory.go(-1);</script>');
		}
	});		
});
module.exports=router;