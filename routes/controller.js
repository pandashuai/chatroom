fs = require('fs');
var formidable = require('formidable');
//用户页面
var homePage = function(req, res) {
	res.render('index', {title: '聊天室', ip: req.ip});
};
var compatiblePage = function(req, res) {
	res.render('compatible', {title: '浏览器不兼容'});
};

var imgfile = function(req, res) {
	var form = new formidable.IncomingForm(); 
	var alert;
	postUriDirectory = req.params.uri;

	form.uploadDir = __dirname + '/../tmp';
	form.maxFieldsSize = 200 * 1024;

	form.on('progress', function(bytesReceived, bytesExpected) {
		if(bytesReceived > form.maxFieldsSize) {
			alert = "文件大小超过限制！";
			res.status(413);
			this.emit('error');
		}
	})
	.on('fileBegin', function(name, file) {
		if(file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/gif") {
			alert = "请上传jpg、png、gif等图像文件！";
			res.status(415);
			this.emit('error');
		}
	})
	.on('file', function(name, file) {
		var extName;
		switch(file.type) {
			case "image/png":
				extName = "png";
				break;
			case "image/gif":
				extName = "gif";
				break;
			default:
				extName = "jpg";
		}
		var alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTOVWXYZ", strLength = 10, strUnique = '';
		for(var i = 0; i < strLength; i++){
			strUnique += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		}
		var date = new Date(),
			dateDirectory = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2),
			dateDay = ("0" + date.getDate()).slice(-2),
			imgPath = __dirname + "/../public/images/charImg";
		if(!fs.existsSync(imgPath + "/" + dateDirectory)) {
			fs.mkdirSync(imgPath + "/" + dateDirectory);
		}
		if(!fs.existsSync(imgPath + "/" + dateDirectory + "/" + dateDay)) {
			fs.mkdirSync(imgPath + "/" + dateDirectory + "/" + dateDay);
		}
		fs.renameSync(file.path, imgPath + "/" + dateDirectory + "/" + dateDay  + "/" + strUnique + date.getTime() + "." + extName);
		res.send("/images/charImg/" + "/" + dateDirectory + "/" + dateDay  + "/" + strUnique + date.getTime() + "." + extName);
	})
	.on('error', function(err) {
		try{
			res.header('Connection', 'close');
			res.send(alert);
		}catch(e){
			console.log(e);
		}
	});
	form.parse(req);
};




module.exports.imgfile = imgfile;


//用户页面
module.exports.homePage = homePage;
module.exports.compatiblePage = compatiblePage;