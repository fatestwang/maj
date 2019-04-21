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
