const cardTypes = ['m', 'p', 's', 'z'];
const visiable = {
    m:'万',
    p:'筒',
    s:'条',
    z:'字'
};
const recordTypes = ['tiles', 'ke', 'shun', 'que', 'redora', 'dora', 'lian', 'qian', 'single'];
class TileInfo {
    constructor() {
        for (let type of recordTypes) {
            this[type] = 0;
        }
        for (let key of cardTypes) {
            this[key] = {};
            for (let type of recordTypes) {
                this[key][type] = 0;
            }
        }
        for (let key of cardTypes)
            for (let i = -1; i <= 11; i++) {
                this[key][i] = {};
                for (let type of recordTypes) {
                    this[key][i][type] = 0;
                }
            }
    }
    refreshInfo() {
        for (let type of recordTypes) {
            this[type] = 0;
            for (let key of cardTypes)
                this[type] += this[key][type];
        }
    }

    set Tiles(val) {
        return this.tiles = val;
    }
    get Tiles() {
        return this.tiles;
    }
    newSingle(key, card) { //key:mpsz, card:1-9
        if (card == 0) { //red five
            this[key].redora++;
            card = 5;
        }
        //顺联
        if (key != 'z') {
            if (this[key][card - 2]['lian'] > 0) {
                this[key][card - 2]['lian']--;
                this[key]['lian']--;
                this[key]['shun']++;
                this[key][card - 2]['shun']++;
                this.refreshInfo();
                return;
            } //左联
            if (this[key][card + 1]['lian'] > 0) {
                this[key][card + 1]['lian']--;
                this[key]['lian']--;
                this[key]['shun']++;
                this[key][card]['shun']++;
                this.refreshInfo();
                return;
            } //右联
            if (this[key][card - 1]['qian'] > 0) {
                this[key][card - 1]['qian']--;
                this[key]['qian']--;
                this[key]['shun']++;
                this[key][card - 1]['shun']++;
                this.refreshInfo();
                return;
            } //中崁
            if (card > 5 && this[key][card - 3]['shun'] > 0 && this[key][card - 5]['lian'] > 0) {
                this[key][card - 3]['shun']--;
                this[key][card - 5]['lian']--;
                this[key][card - 5]['shun']++;
                this[key][card - 2]['shun']++;
                this[key]['lian']--;
                this[key]['shun']++;
                this.refreshInfo();
                return;
            } //左跳联
            if (card > 8 && this[key][card - 3]['shun'] > 0 && this[key][card - 6]['shun'] > 0 && this[key][card - 8]['lian'] > 0) {
                this[key][card - 3]['shun']--;
                this[key][card - 6]['shun']--;
                this[key][card - 8]['lian']--;
                this[key][card - 8]['shun']++;
                this[key][card - 5]['shun']++;
                this[key][card - 2]['shun']++;
                this[key]['lian']--;
                this[key]['shun']++;
                this.refreshInfo();
                return;
            } //左跳二联
            if (card < 5 && this[key][card + 1]['shun'] > 0 && this[key][card + 4]['lian'] > 0) {
                this[key][card + 1]['shun']--;
                this[key][card + 4]['lian']--;
                this[key][card]['shun']++;
                this[key][card + 3]['shun']++;
                this[key]['lian']--;
                this[key]['shun']++;
                this.refreshInfo();
                return;
            } //右跳联
            if (card < 2 && this[key][card + 1]['shun'] > 0 && this[key][card + 4]['shun'] > 0 && this[key][card + 7]['lian'] > 0) {
                this[key][card + 1]['shun']--;
                this[key][card + 4]['shun']--;
                this[key][card + 7]['lian']--;
                this[key][card]['shun']++;
                this[key][card + 3]['shun']++;
                this[key][card + 6]['shun']++;
                this[key]['lian']--;
                this[key]['shun']++;
                this.refreshInfo();
                return;
            } //右跳二联
            if (card > 3 && this[key][card - 3]['qian'] > 0 && this[key][card + 1]['single'] > 0) {
                this[key][card - 3]['qian']--;
                this[key][card + 1]['single']--;
                this[key][card - 3]['signle']++;
                this[key][card - 1]['shun']++;
                this[key]['qian']--;
                this[key]['shun']++;
                return;
            } //左崁跳单
            if (this[key][card + 1]['qian'] > 0 && this[key][card - 1]['single'] > 0) {
                this[key][card + 1]['qian']--;
                this[key][card - 1]['single']--;
                this[key][card + 3]['signle']++;
                this[key][card - 1]['shun']++;
                this[key]['qian']--;
                this[key]['shun']++;
                return;
            } //左单跳崁
        }
        //刻子
        {
            if(this[key][card]['que']>0){
                this[key][card]['que']--;
                this[key][card]['ke']++;
                this[key]['que']--;
                this[key]['ke']++;
                return;
            }//本刻
        }
        //雀头
        {
            if(this[key][card]['single']>0){
                this[key][card]['single']--;
                this[key][card]['que']++;
                this[key]['single']--;
                this[key]['que']++;
                return;
            }//本雀
        }

        //连张
        if(key != 'z'){
            if(this[key][card-1]['single']>0){
                this[key][card-1]['single']--;
                this[key][card-1]['lian']++;
                this[key]['single']--;
                this[key]['lian']++;
                return;
            }//左连
            if(this[key][card+1]['single']>0){
                this[key][card+1]['single']--;
                this[key][card]['lian']++;
                this[key]['single']--;
                this[key]['lian']++;
                return;
            }//右连
        }
        //嵌张
        if(key !='z'){
            if(this[key][card-2]['single']>0){
                this[key][card-2]['single']--;
                this[key][card-2]['qian']++;
                this[key]['single']--;
                this[key]['qian']++;
                return;
            }//左嵌
            if(this[key][card+2]['single']>0){
                this[key][card+2]['single']--;
                this[key][card]['qian']++;
                this[key]['single']--;
                this[key]['qian']++;
                return;
            }//右嵌

        }
        //单张
        this[key][card]['single']++;
        return;
    }
    printDebug() {
        let str = '';
        for (let key of cardTypes) {
            let keyStr = visiable[key];
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['shun'] > 0)
                    str += i + keyStr + (i + 1) + keyStr + (i + 2) + keyStr + '*' + this[key][i]['shun'] + ' ';
                if (this[key][i]['ke'] > 0)
                    str += i + keyStr + i + keyStr + i + keyStr + '*' + this[key][i]['ke'] + ' ';
                if (this[key][i]['que'] > 0)
                    str += i + keyStr + i + keyStr + '*' + this[key][i]['que'] + ' ';
                if (this[key][i]['lian'] > 0)
                    str += i + keyStr + (i + 1) + keyStr + '*' + this[key][i]['lian'] + ' ';
                if (this[key][i]['qian'] > 0)
                    str += i + keyStr + (i + 2) + keyStr + '*' + this[key][i]['qian'] + ' ';
                if (this[key][i]['single'] > 0)
                    str += i + keyStr + '*' + this[key][i]['single'] + ' ';
            }
        }
        console.log(str);
    }
}
class Handcard {
    constructor() {
        this.tileInfo = new TileInfo();
    }
    insertTile(tileInfo) {
        let key = this.getKey(tileInfo);
        let card = parseInt(this.getCard(tileInfo));
        this.tileInfo.newSingle(key, card);
    }
    findWorstTile(){

    }
    deleteTile(tileInfo) {
        let key = this.getKey(tileInfo);
        let card = parseInt(this.getCard(tileInfo));
        this.tileInfo.remove();
    }

    test() {
        this.testTimes = this.testTimes ? this.testTimes++ : 0;
        console.log('testTimes: ', this.testTimes);
        this.tileInfo = new TileInfo();
        let list = [];
        for (let i = 0; i < 136; i++) {
            list.push(i);
        }
        for (let i = 0; i < 136; i++) {
            let key = Math.floor(Math.random() * (136 - i)) + i;
            let t = list[key];
            list[key] = list[i];
            list[i] = t;

        }
        this.timeCost = 0;
        let times = 0;
        for (; times < 136; times++) {
            let now = Date.now();
            let tile = this.tileIDToCode(list[times]);
            this.insertTile(tile);
            console.log('insert tile:',tile);
            this.tileInfo.printDebug();
            if (this.tileInfo.tiles == 14) {
                if (this.ok()) {
                    console.log('hule, use card: ', times + 1 - 13);
                    this.timeCost += (Date.now() - now);
                    break;
                } else {
                    this.deleteTile(this.findWorstTile());
                    this.timeCost += (Date.now() - now);
                }
            }
        }
        console.log('avg time Cost(ms):', Math.floor(this.timeCost / times));
    }
    tileIDToCode(tid) {
        let id = tid;
        let key = Math.floor(id / 36);
        id = id % 36;
        let value = Math.floor(id / 4);
        id = id % 4;
        if (value == 4 && id == 0)
            value = 0;
        else value++;
        let tile = value;
        if (key == 0) tile += 'm';
        if (key == 1) tile += 'p';
        if (key == 2) tile += 's';
        if (key == 3) tile += 'z';
        return tile;
    }

    getKey(tile) {
        return tile[1];
    }
    getCard(tile) {
        return tile[0];

    }
}

let hc = new Handcard();

for (let i = 0; i < 5; i++)
    hc.test();
debugger;