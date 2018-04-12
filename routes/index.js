var express = require('express');
var controller = require('./controller');
var router = express.Router();

router.map = function(obj, route) {
	route = route || '';
	for (var key in obj) {
		if(obj.hasOwnProperty(key)) {
			switch(typeof(obj[key])) {
				case "object":
					router.map(obj[key], route + key);
					break;
				case "function":
					router[key](route, obj[key]);
					break;
			}
		}
	}
}

router.map({
	'/': {
		get: controller.homePage
	},
	'/compatible': {
		get: controller.compatiblePage
	},
	'/upload-file': {
		post: controller.imgfile
	}
});

module.exports = router;
