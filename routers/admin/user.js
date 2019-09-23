//导入express模块
let express=require('express');
//实例化路由
let router=new express.Router();
//导入数据连接池
let pool=require('../../config/pool.js');
//导入时间格式模块
let moment=require('moment');
//导入分页方法
let page=require('../../commen/page.js');

//会员管理路由
router.get('/',(req,res)=>{
	//进行分页处理
	//获取页码
	let p=req.query.p?req.query.p:1;
	//默认每页展示个数
	let size=3;
	//获取搜索框中的数据
	let search=req.query.search?req.query.search:"";
	//从数据库中取出数据
	pool.query("select count(*) tot from user where username like ?",[`%${search}%`],(err,data)=>{
		if(err) throw err;
		if(data.length>0){
			//获取数据总行数
			let tot=data[0].tot;
			let showpage=page(tot,p,size);
			pool.query("select *from user where username like ? order by id desc limit ?,?",[`%${search}%`,showpage.start,showpage.size],(err,data)=>{
				if(err) throw err;
				if(data.length>0){
					//加载页面
					data.forEach(item=>{
						//格式化时间
						item.time=moment(item.time*1000).format("YYYY-MM-DD HH:mm:ss")
					});
					//加载页面,将数据传送给前台
					res.render("admin/user/index.html",{data:data,show:showpage.show,search:search});
				}
			});
		}
	});
});
router.get('/ajax_status',(req,res)=>{
	let {id,status}=req.query;
	pool.query("update user set status=? where id=?",[status,id],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
module.exports=router;