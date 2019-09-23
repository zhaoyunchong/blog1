//引入express框架
let express=require('express');
//初始化express
let app=express();
//导入模板引擎
let ejs=require('ejs');
//导入body-parser中间件
let bodyParser=require('body-parser');
//导入前台路由
let indexRouter=require('./routers/index');
//导入后台路由
let adminRouter=require('./routers/admin');
//引入path模块
let path=require('path');

//设置body-parser中间件 不要使用中间件得默认解析方法
app.use(bodyParser.urlencoded({
	extended:false
}));
//使用前台路由
app.use('/',indexRouter);
//使用后台路由
app.use('/admin',adminRouter);

//设置模板引擎目录存放位置  
//第一个参数是固定的 
//第二个参数是:模板存在的目录
app.set("views","./views"); 
//定义模板引擎 
//第一个参数 模板引擎的名称,模板引擎的后缀
//第二个参数:使用模板引擎的方法
app.engine("html",ejs.__express);
//在app中注册模板引擎
//第一个参数是固定不变的
//第二个参数:与定义的模板引擎的名称有关
app.set('view engine','html');
// 设置静态资源访问
app.use(express.static('./public'));
app.use("/upload",express.static(__dirname+'/upload'));


//加载ueditor 模块
var ueditor = require("ueditor");
 
//使用模块
app.use("/baidu/ueditors", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
 
        var imgname = req.ueditor.filename;
 
        var img_url = '/images/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/baidu/php/config.json');
    }
}));

//监听端口
app.listen(8080,()=>{
	console.log('node服务器已经启动,端口号是8080');
});
