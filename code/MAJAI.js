const Action = require('./ActionList');
const {
    TileInfo
} = require('./TileInfo');

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
    //private
    isSelfOperation(seat) {
        return seat == this.selfSeat;
    }
    doMainJop() {
        if (this.tileInfo.canHe()) {
            this.helper.doZimoAction();
            return;
        }
        let removeTile = this.tileInfo.removeWorstTile();
        if (this.tileInfo.canTing()) {
            this.helper.doLizhiAction(removeTile, removeTile == this.lastTile);
            return;
        }
        //现在还不能杠。。。
        //if(this.tileInfo.canAnGang()){
        //}
        this.helper.doDapaiAction(removeTile, removeTile == this.lastTile);
    }
    doOtherJop() {
        if (this.tileInfo.canRong(tile)) {
            this.helper.doRongAction();
            return;
        }
        if (this.tileInfo.canChi(tile)) {
            this.helper.doCancelAction();
            return;
        }
        if (this.tileInfo.canPeng(tile)) {
            this.helper.doCancelAction();
            return;
        }
        if (this.tileInfo.canGang(tile)) {
            this.helper.doCancelAction();
            return;
        }
    }
    //public
    setHelpelper(helper) {
        this.helper = helper;
    }
    setSeat(seat) {
        this.selfSeat = seat;
    }
    newRound(ju, ben, liqibang, scores, dora, tiles) {
        console.log('---new round start---');
        this.tileInfo = new TileInfo();
        for (let i = 0; i < tiles.length; i++) {
            this.tileInfo.insertCard();
        }
        this.newRoundInited = true;
        console.log('---new round end---');
        this.lastTile = tiles[tiles.length - 1];
        if (this.tileInfo.needDapai()) {
            this.doMainJop();
        }
    }
    roundEnded() {
        this.newRoundInited = false;
    }
    discardTile(seat, tile, is_liqi, is_wliqi, moqie, doras) {
        this.tileInfo.reduceRemain(tile);
        if(this.isSelfOperation()){
            return;
        }
        this.doOtherJop();
    }
    dealTile(seat, tile, doras) {
        this.tileInfo.setDoras(doras);
        this.tileInfo.insertTile(tile);
        this.lastTile = tile;
        if (this.isSelfOperation())
            this.doMainJop()
        else
            this.doOtherJop();
    }
    chiPengGang(seat, tiles, type) {
        let i = 0;
        switch (type) {
            OperationList.chi:
                for (i = 0; i < tiles.length; i++)
                    if (tiles[i] != this.lastTile)
                        this.tileInfo.reduceRemain(tiles[i]);
            break;
            OperationList.peng:
                for (i = 0; i < tiles.length; i++)
                    if (tiles[i] != this.lastTile)
                        this.tileInfo.reduceRemain(tiles[i]);
            break;
            OperationList.ming_gang:
                for (i = 0; i < tiles.length; i++)
                    if (tiles[0] != this.lastTile)
                        this.tileInfo.clearRemain(tiles[i]);
            break;
            return;
        }
        if (this.isSelfOperation()) {
            this.doMainJop();
            return;
        }
    }
    anGangAddGang(seat, tiles, type) {
        let i = 0;
        switch (type) {
            OperationList.add_gang:
                this.tileInfo.clearRemain(tiles[0]);
            break;
            OperationList.an_gang:
                this.tileInfo.clearRemain(tiles[0]);
            break;
            return;
        }
        if (this.tileInfo.canRong(tiles[0])) {
            this.helper.doRongAction();
        }
    }
}