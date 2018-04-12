/* 
 * @Author: sublime text
 * @Date:   2015-11-08 11:34:01
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-04-12 15:09:39
 */

$(document).ready(function() {
    $('.login .input-group input').focus(function(event) {
        $(document).keydown(function(e) {
            if (e.keyCode == 13) {
                $('#login').click();
            }
        });
    }).focus();

    //登录昵称事件
    $('#login').click(function(event) {
        var tmp = $('.login .input-group input').val().replace(/^(\s|u00A0)+|(\s|u00A0)+$/g, '');
        if (tmp == '') {
            return prompt_box('warn', '输入昵称！');
        }
        // if(tmp.length>8) {
        // 	return prompt_box('warn','昵称只能输入8位符号！');
        // }
        if ($('.login img').attr('src') == '') {
            return prompt_box('warn', '亲！请不要恶作剧！');
        }
        tmp = filter(tmp);
        userPortrait = $('.login img').attr('src');
        //判断用户是否已经存在
        socket.emit("chenkData", { nick: tmp, tpye: 'nick', ico: userPortrait });
    });


    //接收统计公共房间各自的总人数
    socket.on("sum", function(room) {
        for (var i in room) {
            var aa = $('.function>.aa.home .room_list .ih-item h3:contains(' + i + ')').parents("a").children('span');
            var bb = $('.search .search-list>.search-list>.col-xs-12.col-sm-4.col-md-3 .roomName:contains(' + i + ')').siblings('.ren');
            if (aa) {
                aa.html('<span class="glyphicon glyphicon-user"></span> ' + room[i] + ' 人');
            }
            if (bb) {
                bb.html('人数：<span style="color:red;">' + room[i] + '</span>');
            }
        }
    });


    // 接收创建房间的事件
    socket.on("cookieRooms", function(createRoom) {
        //先清空房间
        $('.search .search-list>.search-list').empty();
        if (createRoom.length == 0) return prompt_box('warn', '类似的房间不在！请重新搜索。。');
        //再创建
        for (var i in createRoom) {
            $('.search .search-list>.search-list').append(createRoom[i]);
        }
        //为创建房间的增加加入房间按钮
        $('.search .search-list>.search-list .search-roll>p>buttun').click(function(event) {
            if ($(this).parent().siblings('.ren').find('span').text() == 0) {
                prompt_box('warn', '该房间已不存在，请选择加入！');
                $(this).parents('.col-xs-12.col-sm-4.col-md-3').remove();
                return;
            }
            var roomName = $(this).parents('.search-roll').find('.roomName').text();
            var roomJS = $(this).attr("JS");
            var roomPortrait = $(this).parents('.search-roll').find('img').attr('src');
            //创建房间版块
            addroom(roomName, roomJS, roomPortrait);
        });

    });
    //创建房间事件
    $('#addroom').click(function(event) {
        var roomName = $('.plus .roomName').val().replace(/^(\s|u00A0)+|(\s|u00A0)+$/g, '');
        roomName = filter(roomName);
        var roomJS = $('.plus .roomJS').val().replace(/^(\s|u00A0)+|(\s|u00A0)+$/g, '');
        roomJS = filter(roomJS);
        if ($(this).siblings('img').attr('src') == '') {
            return prompt_box('warn', '亲！请不要恶作剧！');
        }
        if (roomName != '') {
            if (roomName == '都市生活' || roomName == '同桌的你' || roomName == '悄悄细语' || roomName == '周公解梦' || roomName == '美食天地' || roomName == '我的闺蜜') return prompt_box('warn', '该房间已存用，请重新创建！');
            socket.emit("chenkData", { roomname: roomName, tpye: 'newrooms', roomJS: roomJS, roomImg: $(this).siblings('img').attr('src') });
        }
    });



    //接收公共房间的初始化
    socket.on("names", function(room) {
        var id = $('.function>.comments>.rooms>.room-info>.room-header>h3:contains(' + room.room + ')').parents('.room-info').index() - 1;
        addmessage(id, 'system-info', '该会话已建立，慢慢聊吧');
    });
    //接收用户列表成员
    socket.on("userList", function(room) {
        var id = $('.function>.comments>.rooms>.room-info>.room-header>h3:contains(' + room.room + ')').parents('.room-info').index() - 1;
        if (room.off) {
            if (room.root.indexOf(userName) != -1) {
                $('.room-info:eq(' + id + ')>.room-side>.user-list ul').append('<li><img src="' + room.ico + '"><b>' + room.nick + '</b><span>' + room.ip + '</span></li>');
            } else {
                $('.room-info:eq(' + id + ')>.room-side>.user-list ul').append('<li><img src="' + room.ico + '"><b>' + room.nick + '</b></li>');
            }
            $('.function>.comments>.rooms .room-info:eq(' + id + ')>.room-side>.user-list').find(".tit").html('聊天室成员(<span style="color:green;"> ' + room.count + '</span> /500)');
        } else {
            $('.room-info:eq(' + id + ')>.room-side>.user-list ul').html('');
        }
    });

    //广播给其它助用户，提醒有用户加入房间
    socket.on("rooms", function(room) {
        var id = $('.function>.comments>.rooms>.room-info>.room-header>h3:contains(' + room.room + ')').parents('.room-info').index() - 1;
        addmessage(id, 'system-info', ('该成员 <span style="color:green;">' + room.nick + '</span> 加入了该房间'));
    });

    //广播给其它助用户，提醒有用户加入房间
    socket.on("addmessage", function(room) {
        var room_id = $('.room-info>.room-header h3:contains(' + room.room + ')').parent().parent().index() - 1;
        if (room.root.indexOf(userName) != -1) {
            addmessage(room_id, 'left-info', [room.ico, room.nick + '<span style="color:#0a0;">(' + room.ip + ')</span>', room.text]);
        } else {
            addmessage(room_id, 'left-info', [room.ico, room.nick, room.text]);
        }
        $('.bimg:last').click(function(event) {
            btimg($(this).attr('src'));
        });
    });



    //广播给其它助用户，提醒有用户离开房间
    socket.on("deluser", function(room) {
        var id = $('.function>.comments>.rooms>.room-info>.room-header>h3:contains(' + room.room + ')').parents('.room-info').index() - 1;
        addmessage(id, 'system-info', ('该成员 <span style="color:green;">' + room.text + '</span> 已离开'));
    });



    $('#userinfo').click(function(event) {
        var tmp = $(this).parents('.input-group').find('.form-control').val().replace(/^(\s|u00A0)+|(\s|u00A0)+$/g, '');
        // var oldName=userName;
        if (tmp == '') {
            return tmp = $(this).parents('.input-group').find('.form-control').attr('placeholder');
        }
        // if(tmp.length>8) {
        // 	return prompt_box('warn','昵称只能输入8位符号！');
        // }
        userPortrait = $('.cog>.cog-main>.main>.cogu>img').attr('src');
        if (userPortrait == '') {
            return prompt_box('warn', '亲！请不要恶作剧！');
        }

        tmp = filter(tmp);
        //判断用户是否已经存在
        socket.emit("chenkData", { nick: tmp, tpye: 'newnick', ico: userPortrait });


        $(this).parents('.input-group').find('.form-control').val('');

    });

    socket.on("chengsNick", function(room) {
        var id = $('.function>.comments>.rooms>.room-info>.room-header>h3:contains(' + room.room + ')').parents('.room-info').index() - 1;
        addmessage(id, 'system-info', room.text);
    });











    //测试搜索房间
    $('#search').click(function(event) {
        var searchsrc = $('.search input.form-control').val().replace(/^(\s|u00A0)+|(\s|u00A0)+$/g, '');
        searchsrc = filter(searchsrc);
        if (searchsrc != "") {
            socket.emit('searchRoom', { roomName: searchsrc });
        }
    });






    //接收判断用户是否存在的事件处理
    socket.on("chenkData", function(data) {
        // 不占用
        if (data.off) {
            switch (data.tpye) {
                case 'nick':
                    userName = data.nick;
                    $('.login').fadeOut(200);
                    $('.cogu img').attr('src', data.ico);
                    $('.cogu .form-control').attr('placeholder', userName);
                    var ip = $('body').attr('ip');
                    socket.emit("logon", {
                        nick: userName,
                        ico: data.ico,
                        ip: ip
                    });
                    $('.login').remove();
                    break;
                case 'newnick':
                    userName = data.nick;
                    $('#userinfo').parents('.input-group').find('.form-control').attr('placeholder', userName);
                    socket.emit("chengsNick", { nick: data.nick, ico: data.ico });
                    prompt_box('succeed', '更改成功！');
                    $('.chardesktop .header ul>li').eq(0).click();
                    break;
                case 'newrooms':

                    var roomName = data.roomname;
                    if (data.roomJS == "") {
                        data.roomJS = "这家伙很懒，什么都没留下.";
                    }

                    var rooms = '<div class="col-xs-12 col-sm-4 col-md-3"><div class="search-roll"><img src="' + data.roomImg + '" alt=""><p class="roomName" >' + roomName + '</p><p class="ren">人数：</p><p><buttun class="btn btn-primary btn-block btn-sm" JS=' + data.roomJS + '>加入房间</buttun></p></div></div>';
                    socket.emit("createRoom", { room: roomName, roomny: rooms, roomJS: data.roomJS });
                    addroom(roomName, data.roomJS, data.roomImg);
                    $('.plus .roomName').val('');
                    $('.plus .roomJS').val('');
                    break;
            }
        }
        // 占用
        else {
            switch (data.tpye) {
                case 'nick':
                    prompt_box('warn', '该昵称已占用，请重新输入！');
                    $('.login .input-group input').focus();
                    break;
                case 'newnick':
                    prompt_box('warn', '该昵称已占用，请重新更改！');
                    $('.main.cogu .input-group input').focus();
                    break;
                case 'newrooms':
                    prompt_box('warn', '该房间已存用，请重新创建！');
                    break;
                case 'errimg':
                    prompt_box('warn', '亲！请不要恶作剧！');
                    break;
                case 'errlength':
                    prompt_box('warn', '昵称只能输入8位符号！');
                    break;
            }
        }
    });
});