class MajSoulHelper{
    constructor(){
        console.log('this is a hacked file!');
    }
    startGame(matchRoomID){
        app.NetAgent.sendReq2Lobby("Lobby", "matchGame", {
            match_mode: matchRoomID
        })
    }
    onMessage(cmd, msg){
        try{
            if(cmd == 'ActionDiscardTile' 
            || cmd == 'ActionDealTile' 
            || cmd == 'ActionChiPengGang' 
            || cmd == 'ActionNewRound' 
            || cmd == 'ActionHule')        
                console.log(cmd, msg);
            else return;
            if(!msg || !msg.operation) return;

            let flag_hu = 0 , flag_rong = 0, flag_other = 0, flag_self = 0;
            for (let i = 0; i < msg.operation.operation_list.length; i++) {
                switch (msg.operation.operation_list[i].type) {
                    case mjcore.E_PlayOperation.rong:
                        flag_rong = !0;
                    case mjcore.E_PlayOperation.eat:
                    case mjcore.E_PlayOperation.peng:
                    case mjcore.E_PlayOperation.ming_gang:
                        flag_other = !0;
                        break;
                    case mjcore.E_PlayOperation.zimo:
                        flag_hu = !0;
                    case mjcore.E_PlayOperation.an_gang:
                    case mjcore.E_PlayOperation.add_gang:
                    case mjcore.E_PlayOperation.liqi:
                    case mjcore.E_PlayOperation.dapai:
                        flag_self = !0;
                        break;
                }
            }
            console.log('fatse flag ', flag_rong, flag_hu, flag_other, flag_self);
            if(flag_rong){

            }
            if(flag_hu){

            }
            if(flag_other){
                setTimeout(this.doAction, 500, 'cancel');
            }
            if(flag_self){
                setTimeout(this.doAction, 500, 'moqie', msg.tile);
            }
        }
        catch(e){
            console.log(e);
        }
    }
    doAction(type, tile = null, tileList = null){
        console.log('fatest doAction ', type, tile , tileList);
        switch(type){
            case 'cancel':
                app.NetAgent.sendReq2MJ("FastTest", "inputChiPengGang", {
                    cancel_operation: !0
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            case 'moqie':
                app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
                    type: mjcore.E_PlayOperation.dapai,
                    tile: tile.toString(),
                    moqie: true,
                    timeuse: uiscript.UI_DesktopInfo.Inst._timecd.timeuse
                }, function (e, t) {
                    e ? app.Log.Error("Action_QiPai 失败") : app.Log.info("Action_QiPai 成功")
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            default:
                console.log('fatest doAction error type');
                break;
        }
    }
}

let majSoulHelper = new MajSoulHelper();