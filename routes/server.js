var socketio = require('socket.io');
var fs = require('fs');
var io;
var ip = {};
//储存用户昵称
var newsName = {};

//储存用户图标
var ico = {};
//储存已知用户
var users = [];
//用于统计公共房间所有用户
var sum = {};
//存创建的房间
var cookieRooms = {};
var root = ['FreeBoy', 'ddp'];

function date() {
    var date = new Date();
    var y = date.getFullYear();
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    return y + '-' + M + '-' + d + ' ' + h + ':' + m;
}

exports.listen = function(server) {
        // 启动Socket.IO服务器，允许它搭载在已有的HTTP服务器上
        // console.log(server);
        io = socketio(server);
        io.sockets.on('connection', function(socket) {
            //查询用户昵称是否占用
            off(socket);
            //用于储存登录用户
            logon(socket);
            //用于加入房间
            newsUser(socket);
            //用于信息交换
            addmessage(socket);
            // 更改昵称
            chengsNick(socket);
            //用于用户关闭该房间
            deluser(socket);
            //用于统计并存储创建房间的个数
            createRoom(socket);
            //用于搜索房间
            searchRoom(socket);
            // 定义用户断开连接后的清除逻辑
            handleClientDisconnection(socket);

        });

    }
    // 更改昵称
function chengsNick(socket) {
    socket.on("chengsNick", function(newNick) {
        var index = users.indexOf(newsName[socket.id]);
        var old = newsName[socket.id];
        delete users[index];
        users.push(newNick.nick);
        newsName[socket.id] = newNick.nick;
        ico[socket.id] = newNick.ico;
        var pub = io.sockets.adapter.sids[socket.id];
        for (var room in pub) {
            if (room != socket.id) {
                userList(socket, room);
                socket.emit("chengsNick", {
                    room: room,
                    nick: newsName[socket.id],
                    text: '你的昵称已更改，现在昵称为：<span style="color:green">' + newsName[socket.id] + '</span>'
                });
                socket.broadcast.to(room).emit("chengsNick", {
                    room: room,
                    nick: newsName[socket.id],
                    text: '<span style="color:green">' + old + '</span>的昵称已更改，现在昵称为：<span style="color:green"> ' + newsName[socket.id] + ' </span>'
                });
            }
        }

    });
}

function sums(socket) {
    socket.emit("sum", sum);
    socket.broadcast.emit("sum", sum);
}
//用于存储创建房间
function createRoom(socket) {
    socket.on("createRoom", function(createRoom) {
        cookieRooms[createRoom.room] = createRoom.roomny;
    });
}

//用于搜索房间
function searchRoom(socket) {
    socket.on("searchRoom", function(rooms) {
        clearcontents(socket);
        var cookie = [];
        for (var room in cookieRooms) {
            if (room.indexOf(rooms.roomName) != -1) {
                cookie.push(cookieRooms[room]);
            }
        }
        socket.emit("cookieRooms", cookie);
        sums(socket);
    });
}
//删除创建房间人数为0的房间
function clearcontents(socket) {
    for (var i in sum) {
        if (i == '都市生活' || i == '同桌的你' || i == '悄悄细语' || i == '周公解梦' || i == '美食天地' || i == '我的闺蜜') {} else {
            if (sum[i] == 0) {
                delete sum[i];
                delete cookieRooms[i];
            }
        }
    }
}

//用于储存登录用户
function logon(socket) {
    socket.on("logon", function(user) {
        //储存用户昵称
        newsName[socket.id] = user.nick;
        //储存用户图标
        ico[socket.id] = user.ico;
        ip[socket.id] = user.ip;
        //储存已知用户
        users.push(user.nick);
        //用于统计公共房间所有用户
        sums(socket);
    });
}


//用于加入房间
function newsUser(socket) {
    socket.on("rooms", function(user) {
        //用户加入房间
        socket.join(user.room);
        //计算房间人数
        if (!sum[user.room]) {
            sum[user.room] = 1;
        } else {
            sum[user.room] += 1;
        }
        sums(socket);
        // 提醒用户可以聊天了
        socket.emit('names', {
            room: user.room,
            of: true
        });
        //广播用户加入了当前房间
        socket.broadcast.to(user.room).emit("rooms", {
            nick: newsName[socket.id],
            room: user.room
        });

        //用户列表
        userList(socket, user.room);

    })
}

//用户列表
function userList(socket, room) {
    var aa = io.sockets.adapter.rooms;
    var count = 0;
    socket.emit('userList', { off: false, room: room });
    socket.broadcast.to(room).emit('userList', { off: false, room: room });
    for (var i in aa[room].sockets) {
        count++;
        socket.emit('userList', {
            nick: newsName[i],
            ico: ico[i],
            room: room,
            off: true,
            count: count,
            root: root,
            ip: ip[i]
        });
        socket.broadcast.to(room).emit('userList', {
            nick: newsName[i],
            ico: ico[i],
            room: room,
            off: true,
            count: count,
            root: root,
            ip: ip[i]
        });
    }
}

//用于信息交换
function addmessage(socket) {
    //用于广播信息
    socket.on("addmessage", function(user) {
        socket.broadcast.to(user.room).emit("addmessage", {
            nick: newsName[socket.id],
            ico: ico[socket.id],
            text: user.text,
            room: user.room,
            ip: user.ip,
            root: root
        });
    });
}
//用于判断是否存在
function off(socket) {
    socket.on("chenkData", function(data) {
        switch (data.tpye) {
            case 'nick':
                publics(socket, data.nick, data.ico, data.tpye);
                break;
            case 'newnick':
                publics(socket, data.nick, data.ico, data.tpye);
                break;
            case 'newrooms':
                var img = __dirname + '/../public/' + data.roomImg;
                if (!fs.existsSync(img)) {
                    return socket.emit("chenkData", { off: false, tpye: 'errimg' });
                }
                for (var i in cookieRooms) {
                    if (i == data.roomname) {
                        socket.emit("chenkData", { off: false, tpye: data.tpye, roomname: data.roomname, roomJS: data.roomJS });
                        return;
                    }
                }
                socket.emit("chenkData", { off: true, tpye: data.tpye, roomname: data.roomname, roomJS: data.roomJS, roomImg: data.roomImg });
                break;
        }
    });
}

function publics(socket, nick, ico, tpye) {
    var img = __dirname + '/../public/' + ico;
    if (!fs.existsSync(img)) {
        return socket.emit("chenkData", { off: false, tpye: 'errimg' });
    }
    if (nick.substr(0, 7) == 'Admin@:') {
        if (root[nick.charAt(7)]) {
            nick = root[nick.charAt(7)];
        }

        if (root.indexOf(nick) != -1 && users.indexOf(nick) == -1) return socket.emit("chenkData", { off: true, nick: nick, tpye: tpye, ico: ico, ip: ip[socket.id] });
    }
    if (nick.length > 8) {
        return socket.emit("chenkData", { off: false, tpye: 'errlength', ico: ico });
    }

    // 占用
    if (users.indexOf(nick) != -1 || root.indexOf(nick) != -1) return socket.emit("chenkData", { off: false, tpye: tpye, ico: ico });
    //不占用
    socket.emit("chenkData", { off: true, nick: nick, tpye: tpye, ico: ico });
}
//用于用户关闭该房间
function deluser(socket) {
    socket.on("deluser", function(rooms) {
        //退出该房间
        socket.leave(rooms.room);
        if (sum[rooms.room]) {
            sum[rooms.room] -= 1;
        }
        sums(socket);


        // 广播当前用户已退出房间
        socket.broadcast.to(rooms.room).emit('deluser', {
            text: newsName[socket.id],
            room: rooms.room
        });

        //重新刷新用户列表
        var bb = io.sockets.adapter.sids[socket.id];
        for (var i in bb) {
            if (i != socket.id) {
                userList(socket, i);
            }
        }
        clearcontents(socket);
    });
}



// 定义用户断开连接后的清除逻辑
function handleClientDisconnection(socket) {
    //全局定义当前用户的逻辑
    var bb = io.sockets.adapter.sids[socket.id];
    socket.on('disconnect', function() {
        var xxnick = newsName[socket.id];
        var xx = users.indexOf(newsName[socket.id]);
        // 删除当前用户昵称
        delete newsName[socket.id];
        // 删除当前用户图标
        delete ico[socket.id];
        // 删除当前用户占有的位置
        delete users[xx];
        for (var i in bb) {
            if (i != socket.id) {
                //广播当前用户离开该房间
                socket.broadcast.to(i).emit('deluser', {
                    text: xxnick,
                    room: i
                });
                //退出当前房间
                socket.leave(i);
                //重新统计房间人数
                // socket.broadcast.to(i).emit("vb",{room:i});
                //重新统计用户列表
                userList(socket, i);
                if (sum[i]) {
                    sum[i] -= 1;
                }
                socket.broadcast.to(i).emit("sum", sum);
            }
        }
        sums(socket);
        clearcontents(socket);
    });
}