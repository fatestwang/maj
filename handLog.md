## 系统命令记录
---
1. 开始游戏：app.NetAgent.sendReq2Lobby("Lobby", "matchGame", {match_mode: matchRoomID}
2. 1


## 对象信息记录
---
1. GameMgr.Inst.account_data: 记录了玩家信息，其中，GameMgr.Inst.account_data.level.id = 10403为玩家等级；
2. cfg.desktop：游戏设置信息，其中，cfg.desktop.matchmode.map_为房间列表，一些有关的信息如下：
   - level_limit: 10101，玩家等级下限
   - level_limit_ceil: 10203，玩家等级上限
    - mode: 2，铜银金为012，玉王为12，1东2南；
    - mode1: 0，未知，猜测为三麻预留
    - mode2: 0，未知，
    - room: 1，房间ID
    - room_name: "铜之间"，
3. mjcore,一些麻将常量数据如吃碰杠单词
4. 


## 测试记录

## 其他记录


## 代码阅读记录

        //fatest 定位：切换立绘
        return e.prototype.setSkin = function(t, e) {
            var i = this,
            n = cfg.item_definition.skin.get(t);
            if (n) {
                var r = n.path + "/" + e + ".png";
                if (r != this.skin_path) {
                    this.skin_path = r,
                    this.change_id++;
                    var a = this.change_id;
                    "" == game.LoadMgr.getResImageSkin(r) ? (this._setLoadedTexture(4e5, e), this.loaded = !1, game.LoadMgr.loadResImage([this.skin_path], Laya.Handler.create(this,
                    function() {
                        a == i.change_id && (i.loaded = !0, i._setLoadedTexture(t, e))
                    }))) : (this.loaded = !0, this._setLoadedTexture(t, e))
                }
            } else this.clear()
        },

        //fatest 修改这处代码，就可以本地跑了
         i.createResImage_web = function(e) {
            var i = this;
            if (!this._resimage.hasOwnProperty(e)) {
                var n = "",
                r = e.substr(e.length - 3);
                n = r.toLocaleLowerCase();
                console.log(e);
                var a = {
                    loaded: !1,
                    origin_url: e,
                    blob_url: null,
                    complete: [],
                    success: !1
                };
                this._resimage[e] = a;
                var s = new Laya.HttpRequest;
                s.once(Laya.Event.COMPLETE, this,
                function(t) {
                    for (var e = new Laya.Byte(t), r = new Laya.Byte, s = 0; s < e.length; s++) 
                        GameMgr.inRelease ? r.writeByte(73 ^ e.readByte()) : r.writeByte(e.readByte());
                    var o = new Laya.Browser.window.Blob([r.buffer], {
                        type: "image/" + n
                    });
                    if(a.origin_url == 'extendRes/charactor/yiji/full.png' ||
                        a.origin_url == 'extendRes/charactor/yiji/half.png' ||
                        a.origin_url == 'extendRes/charactor/yiji/smallhead.png' ||
                        a.origin_url == 'extendRes/charactor/yiji/bighead.png' ||
                        a.origin_url == 'extendRes/charactor/yiji/waitingroom.png'){
                        l = a.origin_url;
                        t = l;
                    }
                    else
                        l = Laya.Browser.window.URL.createObjectURL(o);
                    Laya.loader.load(l, Laya.Handler.create(i,
                    function(t) {
                        a.blob_url = t,
                        a.loaded = !0,
                        a.success = !0;
                        for (var e = 0; e < a.complete.length; e++) a.complete && a.complete[e].run();
                        a.complete = []
                    },
                    [l]), null, Laya.Loader.IMAGE)
                }),
                s.once(Laya.Event.ERROR, this,
                function(t) {
                    console.log("加载" + e + "失败"),
                    a.loaded = !0,
                    a.success = !1;
                    for (var i = 0; i < a.complete.length; i++) a.complete[i] && a.complete[i].run();
                    a.complete = []
                }),
                s.send(t.ResourceVersion.formatURL(e), "", "get", "arraybuffer")
            }
        },


        //fatest 一姬数据
        can_marry: 1
        desc: "出现在魂天神社的最初的雀士其中一人，现任魂天神社巫女，虽然长着猫耳，但很坚定的声称自己是人类。对于她而言，没有什么事情比吃饭和午睡更为重要。"
        desc_age: "未知"
        desc_birth: "1月11日"
        desc_bloodtype: "A"
        desc_cv: "内田真礼"
        desc_hobby: "吃，睡觉"
        desc_stature: "154厘米"
        emo: "extendRes/emo/e200001"
        exchange_item_id: 302002
        exchange_item_num: 75
        favorite: 1
        full_fetter_skin: 400102
        id: 200001
        init_skin: 400101
        name: "一姬"
        open: 1
        sex: 1
        skin_lib: (3) [0, 0, 0]
        sound: 1
        sound_volume: 1
        star_5_cost: 0
        star_5_material: "302010-10,302011-10,303013-5,302002-10,302004-100"

        //fatest 太太设定
        t[33]["rows"][0].name = '星铜';
        t[33]["rows"][0].desc_birth = "10月3日";
        t[33]["rows"][0].desc_cv = '';
        t[33]["rows"][0].desc_age = '95';
        t[33]["rows"][0].desc_hobby = '铝，大海';
        t[33]["rows"][0].desc_stature = '171厘米';
        t[33]["rows"][0].desc_bloodtype = '未知';
        t[33]["rows"][0].desc = '不知何时移居到魂天神社附近的人。除了来神社打麻将以外，也经常见到她和被她称为"提督"的人一起在附近闲逛。似乎隐藏很强的力强，但是，牌技很差。';