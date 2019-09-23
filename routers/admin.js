//导入express
let express=require('express');
//创建路由器
let router=express.Router();

// 后台首页
router.get('/',(req,res)=>{
	res.render('admin/index');
});
router.get('/welcome',(req,res)=>{
	res.render('admin/welcome');
});

//后台管理员管理
let adminRouter=require('./admin/admin');
router.use('/admin',adminRouter);

// 会员管理
let userRouter=require('./admin/user');
router.use('/user',userRouter);

//轮播图管理
let sliderRouter=require('./admin/slider');
router.use('/slider',sliderRouter);

//系统管理
let sysRouter=require('./admin/sys');
router.use('/sys',sysRouter);

//分类管理
let newRouter=require('./admin/newstype');
router.use('/newstype',newRouter);

//新闻管理
let newsRouter=require('./admin/news.js');
router.use('/news',newsRouter);

//栏目管理
// let columnRouter=require('./admin/column');
// router.use('/column',columnRouter);

// //评论管理
// let pinglunRouter=require('./admin/pinglun');
// router.use('/pinglun',pinglunRouter);



//导出路由器对象
module.exports=router;
