let express=require('express');
let router=express.Router();

router.get('/',(req,res)=>{
	res.send('这里是栏目首页!');
});
router.get('/add',(req,res)=>{
	res.send('这里是栏目添加界面!');
});
router.get('/edit',(req,res)=>{
	res.send('这里是栏目修改界面!');
});
router.get('/insert',(req,res)=>{
	res.send('这里是栏目增加操作!');
});
router.get('/save',(req,res)=>{
	res.send('这里是栏目添加操作!');
});
router.get('/delete',(req,res)=>{
	res.send('这里是栏目删除操作!');
});
module.exports=router;