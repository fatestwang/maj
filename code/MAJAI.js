const Action = require('./ActionList');
const OperationList = {
    none: "none",
    dapai: "dapai",
    eat: "eat",
    peng: "peng",
    an_gang: "an_gang",
    ming_gang: "ming_gang",
    add_gang: "add_gang",
    liqi: "liqi",
    zimo: "zimo",
    rong: "rong",
    jiuzhongjiupai: "jiuzhongjiupai",
    babei: "babei",
}
class MAJAI {
    constructor() {
        this.newRoundInited = false;
        this.selfSeat = 0;
    }
    //helper
    setHelpelper(helper) {
        this.helper = helper;
    }
    setSeat(seat) {
        this.selfSeat = seat;
    }
    //record
    initEnviroment(ju, ben, liqibang, scores, dora, tiles) {
        this.enviroment = {
            playerList: {
                0: { //self
                    score: scores[0],
                    handList: 0 == this.selfSeat ? tiles : [],
                    discardList: [],
                    showList: [],
                    isLiZhi: false,
                    isZhenTing: false,
                },
                1: {
                    score: scores[1],
                    handList: 1 == this.selfSeat ? tiles : [],
                    discardList: [],
                    showList: [],
                    isLiZhi: false,
                    isZhenTing: false,
                },
                2: {
                    score: scores[2],
                    handList: 2 == this.selfSeat ? tiles : [],
                    discardList: [],
                    showList: [],
                    isLiZhi: false,
                    isZhenTing: false,
                },
                3: {
                    score: scores[3],
                    handList: 3 == this.selfSeat ? tiles : [],
                    discardList: [],
                    showList: [],
                    isLiZhi: false,
                    isZhenTing: false,
                }
            },
            ju: ju,
            ben: ben,
            liqibang: liqibang,
            doraList: [dora],
        };
    }
    newRound(ju, ben, liqibang, scores, dora, tiles) {
        this.initEnviroment(ju, ben, liqibang, scores, dora, tiles);
        this.newRoundInited = true;
        console.log(this.enviroment);
    }
    roundEnded() {
        this.newRoundInited = false;
    }
    Self() {
        return this.enviroment.playerList[this.selfSeat];
    }
    isSelfOperation() {
        if (this.Self().handList.length % 3 == 2)
            return true;
        return false;
    }
    //response
    //别人打了一张牌/自己摸了一张牌，东起摸最后一张
    doCompareOperation() {
        console.log('debug: start do compare operation.');
        var result = {
            value: 0,
            operantionType: OperationList.none, //
            tile: '', //
            index: '', //
            isMoqie: '', //
        };
        if (this.isSelfOperation()) { //摸牌后操作
            this.judgeDapai(result);
            this.judgeLizhi(result);
            this.judgeAngang(result);
            this.judgeZimo(result);
        } else { //他家打牌后操作
            //this.judgeChi(result);
            //rong
            this.judgeRong(result);
        }
        return result;
    }

    /**
     * 分工步骤，尽量不卡住界面的刷新
     */
    work() {
        var result = this.doCompareOperation();
        switch (result.type) {
            case OperationList.none:
                this.helper.doCancelAction();
                break;
            case OperationList.dapai:
                this.helper.doDapaiAction(tile, isMoqie);
                break;
            case OperationList.an_gang:
                this.helper.doAngangAction(tile);
                break;
            case OperationList.liqi:
                this.helper.doLizhiAction(tile, isMoqie);
                break;
            case OperationList.zimo:
                this.helper.doZimoAction();
                break;
            case OperationList.rong:
                this.helper.doRongAction();
                break;
            default:
                break;
        }
    }

    //judgement
    judgeDapai(result) {
        var searchList = {};
        this.Self.handList.array.forEach(tile => {
            if (searchList[tile]) return;
            searchList[tile] = true;
            //var newCardList = this.Self().handList - tile;
        });
    }

    //api信息通知区
    discardTile(seat, tile, is_liqi, is_wliqi, moqie, doras) {
        this.players[seat].discardTile(tile, is_liqi, is_wliqi, moqie);
        this.enviroment.setDoras(doras);
    }
    dealTile(seat, tile, doras) {
        this.players[seat].dealTile(tile);
        this.enviroment.setDoras(doras);
    }
    chiPengGang(seat, tiles, type) {
        this.players[seat].chiPengGang(type, tiles);
    }
    anGangAddGang(seat, tiles, type) {
        this.players[seat].anGangAddGang(type, tiles);
    }
}