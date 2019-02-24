class MajSoulHelper{
    constructor(){
        console.log('this is a hacked file!');
    }
    startGame(matchRoomID){
        app.NetAgent.sendReq2Lobby("Lobby", "matchGame", {
            match_mode: matchRoomID
        })
    }
    syncGameByStep(cmd, msg){
        try{
            if(cmd == 'ActionDiscardTile' 
            || cmd == 'ActionDealTile' 
            || cmd == 'ActionChiPengGang' 
            || cmd == 'ActionAnGangAddGang'
            || cmd == 'ActionNewRound')        
                console.log(cmd, msg);
            else return;
            
            if(!msg) return;
            switch(cmd){
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
        }
        catch(e){
            console.log(e);
        }
    }

    onMessage(cmd, msg){
        try{
            if(cmd == 'ActionDiscardTile' 
            || cmd == 'ActionDealTile' 
            || cmd == 'ActionChiPengGang' 
            || cmd == 'ActionNewRound' 
            || cmd == 'ActionAnGangAddGang'
            || cmd == 'ActionHule')        
                console.log(cmd, msg);
            else return;
            
            if(!msg) return;
            switch(cmd){
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
                    majAI.newRound(view.DesktopMgr.Inst.seat, msg.ju, msg.ben, msg.liqibang, msg.scores, msg.dora, msg.tiles);
                    break;
                case 'ActionHule':
                    majAI.roundEnded();
                    break;
                default:    
                    break;
            }
            
            
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
            
            majAI.work(this, this.doAction);
        }
        catch(e){
            console.log(e);
        }
    }
    /**
     * type和args需要一一对应
     */
    doAction(args){
        if(args == null || args == undefined) return;
        console.log('fatest doAction ', args);
        switch(args.type){
            case 'cancel':
                app.NetAgent.sendReq2MJ("FastTest", "inputChiPengGang", {
                    cancel_operation: !0
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            case 'dapai':
                app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
                    type: mjcore.E_PlayOperation.dapai,
                    tile: args.tile.toString(),
                    moqie: args.isMoqie,
                    timeuse: uiscript.UI_DesktopInfo.Inst._timecd.timeuse
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            case 'lizhi':
                app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
                    type: mjcore.E_PlayOperation.liqi,
                    tile: e.toString(),
                    moqie: t,
                    timeuse: uiscript.UI_DesktopInfo.Inst._timecd.timeuse
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            case 'zimo':
                app.NetAgent.sendReq2MJ("FastTest", "inputOperation", {
                    type: mjcore.E_PlayOperation.zimo,
                    index: 0
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            case 'rong':
                app.NetAgent.sendReq2MJ("FastTest", "inputChiPengGang", {
                    type: mjcore.E_PlayOperation.rong,
                    index: 0
                }), view.DesktopMgr.Inst.ClearOperationShow();
                break;
            default:
                console.log('fatest doAction error type');
                break;
        }
    }
}

let majSoulHelper = new MajSoulHelper();