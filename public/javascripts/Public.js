/* 
* @Author: sublime text
* @Date:   2015-09-30 13:10:12
* @Last Modified by:   sublime text
* @Last Modified time: 2016-01-14 17:04:14
*/

if(!+[1,]||window.attachEvent){
	window.location.href="/compatible";
};
// if((!+[1,]) && (navigator.appVersion.split(";"))[1].replace(/ /g,"").replace(/\[\]/g,"").replace(/MSIE/g,"")<10){
// 		window.location.href="/compatible";
// };

var userName = "用户昵称";
var userPortrait = "/images/user/default/tx (1).jpg";
var theme;



var socket=io();
$(document).ready(function(){


//------------------------------------------------------

	
	// var a = Math.floor(Math.random()*23+1);
	// userPortrait = '/images/user/default/tx (' + a + ').jpg';
	// $('.login img').attr('src', userPortrait);
	// $('.plus img').attr('src', userPortrait);


	//头像选择
	$('.login img').click(function(event) {
		$('.login input[type="file"]').click();
	});
	$('.login input[type="file"]').change(function(event) {
	
		ajaxUploadFile($(this).get(0).files[0], function(data){
			$('.login img').attr('src', data);
			event.originalEvent.target.files[0]=null;
			
		});
	});

	$('.cogu img').click(function(event) {
		$('.cogu input[type="file"]').click();
	});
	$('.cogu input[type="file"]').change(function(event) {

		ajaxUploadFile($(this).get(0).files[0], function(data){
			$('.cogu img').attr('src', data);
			event.originalEvent.target.files[0]=null;

		});
	});
	$('.plus img').click(function(event) {
		$('.plus input[type="file"]').click();
	});
	$('.plus input[type="file"]').change(function(event) {
	
		ajaxUploadFile($(this).get(0).files[0], function(data){
			$('.plus img').attr('src', data);
		});
	});


	//打开房间
	$('.home a').click(function(event) {
		var room = $(this).find('h3').text();
		var img = $(this).find('img').attr('src');
		var js="这家伙很懒，什么都没留下.";
		addroom(room, js, img);
	});
	


//------------------------------------------------------



	$('.cogzt a').click(function(event) {
		theme = $(this).find('img').attr('data-alt');
		$('.cog>.cog-main>.main>.cogzt>div>span').remove();
		$(this).parent().append('<span><span class="glyphicon glyphicon-ok"></span></span>');
		$('body,.comments>.rooms-list').css({
			'background': 'url(../images/theme/default/'+theme+'_bg.jpg) no-repeat fixed top',
			'background-size': 'cover'
		});
		prompt_box('succeed','更改壁纸成功！');
	});

	$('.theme img').click(function(event) {
		$('body').removeClass().addClass($(this).attr('alt'));
		prompt_box('succeed','更改布局成功！');
	});


	// --滚动条初始化--
	jQuery('.scrollbar-macosx').scrollbar();
	$(document).bind('selectstart', function() {
		// return false;
	});
	// 功能模块初始化
	$('.function>.aa').not('.function>.aa:eq(0)').css('display', 'none'); // ------------------------------------------------------------------------
	$('.cogzt a:eq(0)').click();
	$('.prompt').stop();
	$('.prompt').fadeOut(0); 
	// 功能切换
	$('.header>.function-list>li').click(function(event) {
		if($(this).index() != $('.function>.aa:visible').index()) {
			if($(this).index()==1) {
				if($('.function>.comments ul.rooms-list').text()=='') {
					return prompt_box('warn','当前没有正在通讯的会话！');
				}
			}
			if(!$('.aa.cog').eq(4).attr('style')) {
				$('.cogu img').attr('src', userPortrait);
			}
			$('.function>.aa').css('display', 'none');
			$('.function>.aa').eq($(this).index()).fadeIn(200);
			$('.function>.aa:eq(' + $(this).index() + ')>.aa').fadeIn(200);
			$('.xxx').click();
			if($('.rooms').css('display')=='block') {
				$('.comments>.rooms>.room-info textarea').focus();
			}
		}
	});
	// 小屏幕功能切换
	$('.btnk>span').click(function(event) {
		$('ul.function-list').fadeIn(200);
		$('.xxx').fadeIn(200);
		$('.room-header *').not('.js').fadeOut(200);
		$('.comments .icon-chevron-down').fadeOut(200);
		$('.xxx').click(function(event) {
			$('ul.function-list').fadeOut(200,function() {
				$('ul.function-list').attr('style', '');
			});
			$('.room-header *').not('.js').fadeIn(200,function () {
				$('.function>.aa.comments>.icon-chevron-down').attr('style', '');
				$('.room-header *').not('.js').attr('style', '');
			});
			$('.comments .icon-chevron-down').fadeIn(200);
			$('.xxx').fadeOut(200);
			$('.xxx').off('click');
		});
	});
	// 小屏幕房间切换
	$('.function>.aa.comments>.icon-chevron-down').click(function(event) {
		$('.xxx').fadeIn(200);
		$('.comments>.rooms-list').slideToggle(200);
		$('.room-header *').not('.js').fadeOut(200);
		$('.xxx').click(function(event) {
			$('.comments>.rooms-list').slideToggle(200,function() {
				$('.comments>.rooms-list').attr('style', '');
				$('.comments>.rooms-list').css('background', 'url(../images/theme/default/'+theme+'_bg.jpg) no-repeat fixed top');
			});
			$('.room-header *').not('.js').fadeIn(200,function () {
				$('.function>.aa.comments>.icon-chevron-down').attr('style', '');
				$('.room-header *').not('.js').attr('style', '');
			});
			$('.xxx').fadeOut(200);
			$('.xxx').off('click');
		});
	});
	// 设置功能切换
	$('.cog>.cog-list>.cog-list>li').click(function(event) {
		if($(this).index() != $('.cog-main>.main:visible').index()-1) {
			$('.cog>.cog-main>.tit>b').text($(this).text());
			$('.cog>.cog-main').fadeIn(200);
			$('.cog>.cog-main>.main').fadeOut(200);
			$('.cog>.cog-main>.main').eq($(this).index()).fadeIn(200);
		}
	});
	// $('.cog>.cog-list>.cog-list>li').eq(0).click();
	$('.cog>.cog-main>.tit>span').click(function(event) {
		$('.cog>.cog-main').fadeOut(200, function() {
			$('.cog>.cog-main').attr('style', '');
		});
	});
	//设置快捷按钮下拉框启动
	$('.cogs>div>.btn-group>.dropdown-menu>li>a').click(function(event) {
		$(this).parent().parent().prev().find('b').html($(this).html());
	});
});



//------------------------------------------------------




//图片查看器
function btimg (uri) {
	$('.btimg').fadeIn(200);
	$('.btimg>img').attr('src', uri);
	$('.btimg>img').css({
		'max-width': 'none',
		'max-height': 'none'
	});
	var biwh = $('.btimg>img').width();
	$('.btimg>img').css({
		'max-width': '95%',
		'max-height': '95%'
	});
	$('.btimg>img').attr('diwh', '1.0 0');
	var diwh = $('.btimg>img').attr('diwh').split(" ");
	biwh = biwh/$('.btimg>img').width().toFixed(1);
	$('.btimg>img').css({
		'top': '50%',
		'left': '50%',
		'transform': 'scale(' + diwh[0] + ',' + diwh[0] + ') rotate(' + diwh[1] + 'deg)',
		'margin-top': 0 - $('.btimg>img').height()/2,
		'margin-left': 0 - $('.btimg>img').width()/2
	});
	// 图片拖地
	$('.btimg>img').mousedown(function(event) {
		var mousedownX = event.pageX;
		var mousedownY = event.pageY;
		var imgLeft = $('.btimg>img').css('left').replace('px','') - 0 ;
		var imgTop = $('.btimg>img').css('top').replace('px','') - 0 ;
		$('.btimg>img').css({
			opacity: '.75',
			cursor: 'move'
		});
		$('body').mousemove(function(event) {
			var mousemoveX = event.pageX - mousedownX;
			var mousemoveY = event.pageY - mousedownY;

			$('.btimg>img').css({
				left: imgLeft + mousemoveX + 'px',
				top: imgTop + mousemoveY + 'px'
			});
		})
		$(document).mouseup(function(event) {
			$('.btimg>img').css({
				opacity: '1',
				cursor: 'pointer'
			});
			$('body').off( "mousemove");
			$('body').off( "mouseup");
		});
	});
	// 图片功能
	$('.btimg>.btnimg>span').click(function(event) {
		var diwh = $('.btimg>img').attr('diwh').split(" ");
		switch($(this).attr('class')) {
			case 'icon-remove':
				$('.btimg').fadeOut(200);
				break;
			// 图片缩小
			case 'icon-minus k':
				if((diwh[0]-0.1)>0) {
					$('.btimg>img').attr('diwh', (diwh[0]-0.1).toFixed(1) + ' ' + diwh[1]);
				}
				break;
			// 图片放大
			case 'icon-plus k':
				if((diwh[0]-0+0.1)<biwh) {
					$('.btimg>img').attr('diwh', (diwh[0]-0+0.1).toFixed(1) + ' ' + diwh[1]);
				}
				break;
			// 图片1:1比例
			case 'icon-resize-full k':
				$('.btimg>img').attr('diwh', biwh.toFixed(1) + ' ' + diwh[1]);
				$(this).attr('class', 'icon-resize-small k');
				$('.btimg>img').css({
					'top': '50%',
					'left': '50%',
					'margin-top': 0 - $('.btimg>img').height()/2,
					'margin-left': 0 - $('.btimg>img').width()/2
				});
				break;
			// 图片缩放
			case 'icon-resize-small k':
				$('.btimg>img').attr('diwh', '1 ' + diwh[1]);
				$(this).attr('class', 'icon-resize-full k');
				$('.btimg>img').css({
					'top': '50%',
					'left': '50%',
					'margin-top': 0 - $('.btimg>img').height()/2,
					'margin-left': 0 - $('.btimg>img').width()/2
				});
				break;
			case 'icon-undo k':
				$('.btimg>img').attr('diwh', diwh[0] + ' ' + (diwh[1]-0+90));
				break;
			case 'icon-repeat k':
				$('.btimg>img').attr('diwh', diwh[0] + ' ' + (diwh[1]-90));
				break;
			default:
		}
		diwh = $('.btimg>img').attr('diwh').split(" ");
		$('.btimg>img').css('transform', 'scale(' + diwh[0] + ',' + diwh[0] + ') rotate(' + diwh[1] + 'deg)');
	});
}
// 追加房间
function addroom (name, js, img) {
	for (var i = 0; i < $('.function>.comments ul.rooms-list>li').length; i++) {
		if($('.function>.comments ul.rooms-list>li:eq(' + i + ')>b').text()==name) {
			$('.header>.function-list>li:eq(1)').click();
			$('.function>.comments ul.rooms-list>li:eq(' + i + ')').click();
			return;
		}
	}


	// 追加房间
	var time = new Date;
	$('.function>.comments ul.rooms-list').append('<li><span class="js">0</span><img src="' + img + '"><b>' + name + '</b><span class="icon-remove kg"></span></li>');
	$('.function>.comments>.rooms').append('<div class="room-info" time="' + time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate() + ' ' + time.getHours()+':'+time.getMinutes()+':'+time.getSeconds() + '"><div class="room-header"><h3>' + name + '</h3><span class="js">' + js + '</span><span class="icon-user"></span></div><div class="room-main"><div class="room-char"><ul class="content scrollbar-macosx"></ul></div><div class="room-footer"><div class="fplug-in"><span class="icon-github-alt"></span><span class="icon-picture"></span><span class="icon-trash"></span><input type="file", accept="image/*"><div></div></div><div class="textbox"><textarea class="scrollbar-macosx"></textarea></div><div class="btnbox"><span>还可以输入<b>500</b>个字</span><button class="btn btn-primary btn-sm" type="button">发送</button></div></div></div><div class="room-side"><div class="intro"><div class="tit">群通知</div><div class="content"></div></div><div class="user-list"><div class="tit">聊天室成员(374/500)</div><ul class="content scrollbar-macosx"></ul></div></div></div>');
	for (var i = 1; i < 76; i++) {
		$('.room-info:last .fplug-in>div').append('<span alt="'+i+'"></span>');
	}
	$('.room-info:last .fplug-in>div>span').hover(function() {
		if($(this).html() == '') {
			$(this).html('<img src="images/face/'+($(this).attr('alt'))+'.gif", ondragstart="return false;", alt="'+($(this).attr('alt'))+'">')
			$(this).find('img').click(function(event) {
				var i = $(this).parents('.room-info').index()-1;
				$('.room-info:eq(' + i + ')>.room-main>.room-footer>.textbox textarea').val($('.room-info:eq(' + i + ')>.room-main>.room-footer>.textbox textarea').val() + '[em_' + $(this).attr('alt') + ']');
				$('.room-info:eq(' + i + ')>.room-main>.room-footer>.textbox textarea').focus();

				$('.room-info:last>.room-main>.room-footer>.textbox textarea').focus();
				$('.room-info>.room-main>.room-footer>.fplug-in>div').css('display', 'none');
			});
		}else{
			$(this).find('img').show();
		}
	}, function() {
		$(this).find('img').hide();
	});




	//--------------------添加房间事件-----------------------------------------------------------
	socket.emit("rooms",{room:name});
	//--------------------------------------------------------------------------------------------

	



	// 所有房间隐藏
	$('.comments>.rooms>.room-info').css('display', 'none');
	// 显示追加后的房间
	$('.comments>.rooms>.room-info:last').fadeIn(200);
	// 为追加的房间添加切换房间事件
	$('.function>.comments ul.rooms-list>li:last').click(function(event) {
		if($(this).index() != $('.function>.comments .rooms>.room-info:visible').index()-1) {
			$(this).find('.js').css('display', 'none');
			$(this).find('.js').text(0);
			$('.function>.comments ul.rooms-list>li').removeClass('i');
			$(this).addClass('i');
			$('.comments>.rooms>.room-info').css('display', 'none');
			$('.comments>.rooms>.room-info').eq($(this).index()).fadeIn(200);
			$('.comments>.rooms>.room-info:eq(' + $(this).index() + ') textarea').focus();
			$('.xxx').click();
		}
	});
	// 小屏幕房间内用户列表开关
	$('.room-info:last .icon-user').click(function(event) {
		$(this).parent('.room-header').nextAll('.room-side').slideToggle(200,function() {
			if($(this).css('display')!='none') {
				$('.function-list,.rooms-list,.room-main').click(function(event) {
					if($('.room-info:last .icon-user').css('display')!='none') {
						$('.room-side').slideToggle(200);
						$('.function-list,.rooms-list,.room-main').off('click');
					}
				});
			}else{
				$('.function-list,.rooms-list,.room-main').off('click');
				$(this).attr('style', '');
			}
		});
	});
	
	// 为追加的房间添加发送消息事件
	$('.room-info:last>.room-main>.room-footer>.btnbox>button').click(function(event) {
		var info = $(this).parent().prev().find('textarea');
		var infoval = info.val().replace(/^(\s|u00A0)+|(\s|u00A0)+$/g,'');
		if(infoval!='' && infoval.length<501) {
			infoval=filter(infoval);
			infoval = infoval.replace(/\[em_([1-7]?[0-9])\]/g,'<img src="images/face/$1.gif" alt="" />');
			var room = $(this).parents('.rooms>.room-info').index()-1;
			addmessage(room, 'right-info', [userPortrait,userName,infoval]);

	//-------------------------------发送信息事件 --------------------------------------------
			var roomName=$(this).parent().parent().parent().siblings(".room-header").find('h3').html();
				socket.emit("addmessage",{text:infoval,room:roomName, ip:$('body').attr('ip')});
	//--------------------------------------------------------------------------------------------
			info.val('');
			info.focus();
			$(this).parent().find('b').text(500);
		}
	});
	$('.room-info:last>.room-main>.room-footer>.textbox textarea').keyup(function(event) {
		if($(this).val().length>500) {
			$(this).val($(this).val().substr(0,500));
		}
		$(this).parents('.textbox').next('.btnbox').find('b').text(500 - $(this).val().length);
	});
	$('.room-info:last>.room-main>.room-footer>.textbox textarea').keydown(function(event) {
		var i = $(this).parents('.room-info').index()-1;
		if((event.ctrlKey) && (event.keyCode==13) && ($('.cogs>.kjj>.btn-group>button>b>kbd').text()=='Ctrl+Enter')) {
			$('.room-info:eq(' + i + ')>.room-main>.room-footer>.btnbox>button').click();
		}
		if(((event.keyCode==13) && ($('.cogs>.kjj>.btn-group>button>b>kbd').text()=='Enter'))) {
			if((event.ctrlKey)) {
				$(this).val($(this).val() + '\n');
				$(this).scrollTop($(this).prop('scrollHeight'));
			}else{
				$('.room-info:eq(' + i + ')>.room-main>.room-footer>.btnbox>button').click();
				return false;
			}
		}
	});

	// 表情包
	$('.room-info:last>.room-main>.room-footer>.fplug-in>.icon-github-alt').click(function(event) {
		var i = $(this).parents('.room-info').index()-1;
		$('.room-info:eq(' + i + ')>.room-main>.room-footer>.fplug-in>div').css('display', 'block');
		$('.function-list,ul.rooms-list,.room-header,.room-char,.textbox,.btnbox,.room-side').click(function(event) {
			$('.room-info>.room-main>.room-footer>.fplug-in>div').css('display', 'none');
			$('.function-list,ul.rooms-list,.room-header,.room-char,.textbox,.btnbox,.room-side').off('click');
		});
	});
	// 图片
	$('.room-info:last>.room-main>.room-footer>.fplug-in>.icon-picture').click(function(event) {
		var i = $(this).parents('.room-info').index()-1;
		$('.room-info:eq(' + i + ')>.room-main>.room-footer>.fplug-in>input').click();
	});
	$('.room-info:last>.room-main>.room-footer>.fplug-in>input').change(function(event) {
		
		var rooms=$(this).parent().parent().parent().siblings(".room-header").find('h3').text();
		var i = $(this).parents('.room-info').index()-1;
		ajaxUploadFile($(this).get(0).files[0], function(data){
			
			addmessage(i, 'right-info', [userPortrait,userName,"<img class='bimg' src=" + data +">"]);

			


	//--------------图片发送------------------------------------------------
			socket.emit("addmessage",{text:"<img class='bimg' src=" + data +">",room:rooms,ip:$('body').attr('ip')});
	//-----------------------------------------------------------------------
		$('.room-info:last>.room-main>.room-footer>.fplug-in>input')[0].files[0] = null;
		
			$('.bimg:last').click(function(event) {
				btimg($(this).attr('src'));
			});
		});
	});
	//清空聊天信息
	$('.room-info:last>.room-main>.room-footer>.fplug-in>.icon-trash').click(function(event) {
		var i = $(this).parents('.room-info').index()-1;
		$('.room-info:eq(' + i + ')>.room-main>.room-char ul.content').html('');
	});
	// 为追加的房间添加滚动条事件
	jQuery('.comments>.rooms>.room-info:last .scrollbar-macosx').scrollbar();
	$('.header>.function-list>li:eq(1)').click();

	$('.function>.comments ul.rooms-list>li').removeClass('i');
	$('.function>.comments ul.rooms-list>li:last').addClass('i');
	// 为追加的房间添加关闭房间事件
	$('.function>.comments ul.rooms-list>li:last>span').click(function(event) {
		//---------------------------关闭房间事件------------------------------------------------------
			var rooms=$(this).siblings('b').text();
			socket.emit("deluser",{room:rooms});
		//--------------------------------------------------------------------------------------------		
			var aabb=$(this).parent().index();

			$('.function>.comments ul.rooms-list>li').eq(aabb).remove();
			$('.comments>.rooms>.room-info').eq(aabb).remove();
			if((aabb-1)<0) {
				$('.function>.comments ul.rooms-list>li').eq(0).click();
			}else{
				$('.function>.comments ul.rooms-list>li').eq(aabb-1).click();
			}
			if($('.function>.comments ul.rooms-list').text()=='') {
				$('.header>.function-list>li').eq(0).click();
			}
			// socket.emit("deluser",{room:rooms});
	});

}
// 聊天室信息处理
function addmessage (room, message_type, message) {
	var q;
	switch(message_type) {
		case 'system-info':
			// message=系统信息
			q='<li class="' + message_type + '"><span>' + message + '</span></li>'
			break;
		case 'left-info':
			// message=[头像，名称，信息]
			q='<li class="' + message_type + '"><img src="' + message[0] + '" alt=""><b>' + message[1] + '</b><div class="info"><div>' + message[2] + '</div></div></li>'
			break;
		case 'right-info':
			// message=[头像，名称，信息]
			q='<li class="' + message_type + '"><img src="' + message[0] + '" alt=""><b>' + message[1] + '</b><div class="info"><div>' + message[2] + '</div></div></li>'
			break;
		default:
			return;
	}
	var time = new Date;
	var dtime = $('.room-info').eq(room).attr('time');
		dtime = dtime.replace(/-/g,"/");
		dtime = new Date(dtime);
	scrollbottom(room);
	if(time.getTime()-dtime.getTime()>300000 || $('.rooms>.room-info:eq(' + room + ')>.room-main>.room-char ul.content').text()=='') {
		$('.rooms>.room-info:eq(' + room + ')>.room-main>.room-char ul.content').append('<li class="time">' + time.getHours()+':'+time.getMinutes()+':'+time.getSeconds() + '</li>');
		$('.rooms>.room-info:eq(' + room + ')').attr('time', time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate() + ' ' + time.getHours()+':'+time.getMinutes()+':'+time.getSeconds());
	}
	$('.rooms>.room-info:eq(' + room + ')>.room-main>.room-char ul.content').append(q);

	if((room!=$('ul.rooms-list>li.i').index()) && (message_type == 'left-info' || message_type == 'right-info')) {
		$('ul.rooms-list>li:eq('+room+')>.js').css('display', 'block');
		if(($('ul.rooms-list>li:eq('+room+')>.js').text()-0)<99) {
			$('ul.rooms-list>li:eq('+room+')>.js').text(($('ul.rooms-list>li:eq('+room+')>.js').text()-0)+1);
		}else{
			$('ul.rooms-list>li:eq('+room+')>.js').text('99+');
		}
	}
}
// 滚动条滚到最下面
function scrollbottom (room) {
	var scroll = $('.rooms>.room-info:eq(' + room + ')>.room-main>.room-char ul.content');
	setTimeout(function(){
		scroll.stop();
		scroll.animate({
			scrollTop: scroll.prop('scrollHeight')
		}, 500);
	},50); 
}
// 图片上传
function ajaxUploadFile(file, callback){
	var formData = new FormData();
	formData.append('file', file);
	if(file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/gif"){
		return prompt_box('warn','请上传jpg、png、gif等图像文件！');
	}
	if(file.size > 200 * 1024){
		return prompt_box('warn','文件大小不能超过200KB！');
	}
	$.ajax({
		url: '/upload-file',
		type: 'POST',
		processData: false,
		contentType: false,
		data: formData
	})
	.done(function(data) {
		callback(data);
	})
	.fail(function(xhr, statusText) {
		if(xhr.status == 413 || xhr.status == 415){
			prompt_box('warn',xhr.responseText);

		}
	});
}
// 搜索房间
function searchroom(searchsrc){
	$('.search .search-list').html('');
	var len = 50;
	if(len>13) {
		len = 12;
	}
	for (var i = 0; i < len; i++) {
		$('.search .search-list').append('<div class="col-xs-12 col-sm-4 col-md-3"><div class="search-roll"><img src="/images/user/default/1.jpg" alt=""><p class="roomName">用户名</p><p calss="ren">人数：</p><p><buttun class="btn btn-primary btn-block btn-sm">加入房间</buttun></p></div></div>');
	}

}

// 警告框
function prompt_box(type, text) {
	switch(type) {
		case 'warn':
			text = '<span class="glyphicon glyphicon-info-sign" style="color: #f55;"></span>'+text;
			break;
		case 'succeed':
			text = '<span class="glyphicon glyphicon-ok" style="color: #5f5;"></span>'+text;
			break;
	}
	$('.prompt').stop();
	$('.prompt>.text').html(text);
	$('.prompt').fadeIn(200, function() {
		$('.prompt').fadeOut(2500); 
	});

}

function filter(src) {
	src = src.replace(/\</g,'&lt;');
	src = src.replace(/\>/g,'&gt;');
	return src;
}