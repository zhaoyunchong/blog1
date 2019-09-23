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
//引入文件上传模块
let uploads=require('../../commen/uploads.js');

//系统设置首页
router.get('/',(req,res,next)=>{
	//读取文件信息
	let fileData=fs.readFileSync(__dirname+'/../../config/webConfig.json');
	let data=JSON.parse(fileData.toString());
	//加载界面
	res.render('admin/system/index.html',{data:data});
});

//系统管理更新操作
router.post('/save',upload.single('logo'),(req,res,next)=>{
	//获取上传文件的信息
	let imgRes=req.file;
	//接收前台表单上传的数据
	let {title,keyword,detail,oldlogo}=req.body;
	let arr=[];
	let sql="";
	//判断用户是否修改网站logo
	let newLogo="";
	if(imgRes){
		newLogo=uploads(imgRes);
	}
	logo=newLogo?newLogo:oldlogo;
	//格式化数据,将json对象 转换成json字符串存入文件中
	let data={
		title,
		keyword,
		detail,
		logo
	}
	fs.writeFileSync(__dirname+"/../../config/webConfig.json",JSON.stringify(data));
	if(imgRes){
		fs.unlinkSync(__dirname+'/../../'+oldlogo);
	}
	res.send("<script>alert('修改成功!');location.href='/admin/sys';</script>")
});

module.exports=router;