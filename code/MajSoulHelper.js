const MAJAI = require('./MAJAI');
const Action = require('./ActionList');

let ai = new MAJAI();

class MajSoulHelper {
    constructor() {
        this.inGame = false;
        this.inWaiting = false;
        this.noResponseTimes = 0;
        this.getMessageTimes = 0;
        console.log('this is a hacked file!');
        ai.setHelpelper(this);
        setInterval(() => {
            this.checkGameStates();
        }, 10000);
    }
    checkGameStates(){
        if(!this.inGame && !this.inWaiting){
            this.startGame();
            return;
        }
        if(this.inWaiting){
            return;
        }
        if(this.getMessageTimes == 0){
            this.noResponseTimes ++;
        }
        else{
            this.noResponseTimes = 0;
            this.getMessageTimes = 0;
        }
        if(this.noResponseTimes >=3 ){
            window.location.reload();
        }
    }

    //自动加入最高级的东房间
    startGame() {
        let maxRoomID = 2;
        let level = GameMgr.Inst.account_data.level.id;
        for(let i = 3; i< 16; i++)
            if(cfg.desktop.matchmode.map_[i].mode == 1){
                if(cfg.desktop.matchmode.map_[i].level_limit <= level &&
                    cfg.desktop.matchmode.map_[i].level_limit_ceil >= level)
                maxRoomID = i;
            }
        console.log(level, cfg.desktop.matchmode.map_[maxRoomID].room_name);
        app.NetAgent.sendReq2Lobby("Lobby", "matchGame", {
            match_mode: maxRoomID
        })
        this.inWaiting = true;
    }

    syncGameByStep(cmd, msg) {
        try {
            if (cmd == 'ActionDiscardTile' ||
                cmd == 'ActionDealTile' ||
                cmd == 'ActionChiPengGang' ||
                cmd == 'ActionAnGangAddGang' ||
                cmd == 'ActionNewRound')
                console.log(cmd, msg);
            else return;

            if (!msg) return;
            switch (cmd) {
                case 'ActionDiscardTile':
                    majAI.discardTile(msg.seat, msg.tile, msg.is_liqi, msg.is_wliqi, msg.moqie, msg.doras);
                    break;
                case 'ActionDealTile':
                    majAI.dealTile(msg.seat, msg.tile, msg.doras);
                    break;
                case 'ActionChiPengGang':
                    majAI.chiPengGang(msg.seat, msg.tiles, msg.type);
                    break;
                case 'ActionAnGangAddGang':
                    majAI.anGangAddGang(msg.seat, msg.tiles, msg.type);
                    break;
                case 'ActionNewRound':
                    majAI.setSeat(view.DesktopMgr.Inst.seat);
                    majAI.newRound(msg.ju, msg.ben, msg.liqibang, msg.scores, msg.dora, msg.tiles);
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }
    onMessage(cmd, msg) {
        this.inGame = true;
        this.inWaiting = false;
        this.getMessageTimes ++;
        try {
            if (cmd == 'ActionDiscardTile' ||
                cmd == 'ActionDealTile' ||
                cmd == 'ActionChiPengGang' ||
                cmd == 'ActionNewRound' ||
                cmd == 'ActionAnGangAddGang' ||
                cmd == 'ActionHule')
                console.log(cmd, msg);
            else return;

            if (!msg) return;
            switch (cmd) {
                case 'ActionDiscardTile':
                    majAI.discardTile(msg.seat, msg.tile, msg.is_liqi, msg.is_wliqi, msg.moqie, msg.doras);
                    break;
                case 'ActionDealTile':
                    majAI.dealTile(msg.seat, msg.tile, msg.doras);
                    break;
                case 'ActionChiPengGang':
                    majAI.chiPengGang(msg.seat, msg.tiles, msg.type);
                    break;
                case 'ActionAnGangAddGang':
                    majAI.anGangAddGang(msg.seat, msg.tiles, msg.type);
                    break;
                case 'ActionNewRound':
                    majAI.setSeat(view.DesktopMgr.Inst.seat);
                    majAI.newRound(msg.ju, msg.ben, msg.liqibang, msg.scores, msg.dora, msg.tiles);
                    break;
                case 'ActionHule':
                    majAI.roundEnded();
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * type和args需要一一对应
     */
    doCancelAction(){
        app.NetAgent.sendReq2MJ("FastTest", "inputChiPengGang", {
            cancel_operation: !0
        }), view.DesktopMgr.Inst.ClearOperationShow();
    }
    doDapaiAction(tile, isMoqie){
        app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
            type: mjcore.E_PlayOperation.dapai,
            tile: tile,
            moqie: isMoqie,
            timeuse: uiscript.UI_DesktopInfo.Inst._timecd.timeuse
        }), view.DesktopMgr.Inst.ClearOperationShow();
    }
    doLizhiAction(tile, isMoqie){
        app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
            type: mjcore.E_PlayOperation.liqi,
            tile: tile,
            moqie: isMoqie,
            timeuse: uiscript.UI_DesktopInfo.Inst._timecd.timeuse
        }), view.DesktopMgr.Inst.ClearOperationShow();
    }
    doZimoAction(){
        app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
            type: mjcore.E_PlayOperation.zimo,
            index: 0
        }), view.DesktopMgr.Inst.ClearOperationShow();
    }
    doRongAction(){
        app.NetAgent.sendReq2MJ("FastTest", "inputChiPengGang", {
            type: mjcore.E_PlayOperation.rong,
            index: 0
        }), view.DesktopMgr.Inst.ClearOperationShow();
    }
}

module.exports = MajSoulHelper;