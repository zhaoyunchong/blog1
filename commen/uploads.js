//导入文件模块
const fs=require('fs');
//导入路径模块
const path=require('path');

function uploads(imgRes,userPath=""){
	//获取上传的临时文件
	let tmpPath=imgRes.path;
	//获取文件名的后缀
	let ext=path.extname(imgRes.originalname);
	//给文件重新命名
	let newName=""+(new Date().getTime())+Math.round(Math.random()*10000)+ext;
	//设置文件的存放目录
	let newPath="/upload/"+userPath+"/"+newName;
	//进行文件拷贝,同步读取数据
	let fileData=fs.readFileSync(tmpPath);
	//同步写入文件
	fs.writeFileSync(__dirname+'/../'+newPath,fileData);
	//返回新生成的文件路径
	return newPath;
}

module.exports=uploads;