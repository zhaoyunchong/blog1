//导入express类
let express=require('express');

//实例化路由类
let router=express.Router();

//前台首页
router.get('/',(req,res)=>{
	res.render('home/index');
});

//前台分类页面
router.get('/list',(req,res)=>{
	res.send('blog项目分类首页');
});

//前台新闻详情页面
router.get('/news',(req,res)=>{
	res.send('blog项目新闻首页');
});

//前台登陆页面
router.get('/login',(req,res)=>{
	res.send('blog项目登陆首页');
});

//前台注册页面
router.get('/reg',(req,res)=>{
	res.send('blog项目注册首页');
});

module.exports=router;//导出路由器对象



