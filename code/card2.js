const cardTypes = ['m', 'p', 's', 'z'];
const visiable = {
    m: '万',
    p: '筒',
    s: '条',
    z: '字'
};
const recordTypes = ['tiles', 'ke', 'shun', 'que', 'redora', 'dora', 'lian', 'qian', 'single', 'amount'];
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
    //private-----------------------------------
    canCombineLeft(key, card) {

    }
    doCombineLeft(key, card) {

    }
    calcXiangtingValue() {
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['shun'] > 0) {
                    this[key][i]['val'] = 100;
                    this[key][i + 1]['val'] = 100;
                    this[key][i + 2]['val'] = 100;
                }
            }
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['ke'] > 0 && this['que'] == 0) {
                    this[key][i]['val'] = 50;
                    this[key][i + 1]['val'] = 50;
                    this[key][i + 2]['val'] = 50;
                }
                if (this[key][i]['ke'] > 0 && this['que'] > 0) {
                    this[key][i]['val'] = 100;
                    this[key][i + 1]['val'] = 100;
                    this[key][i + 2]['val'] = 100;
                }
            }
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['lian'] > 0) {
                    this[key][i]['val'] = i == 1 || i == 8 ? 35 : 70;
                    this[key][i + 1]['val'] = i == 1 || i == 8 ? 35 : 70;
                }
            }
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['que'] > 0) {
                    this[key][i]['val'] = this['que'] > 1 ? 40 : 60;
                }
            }
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['qian'] > 0) {
                    this[key][i]['val'] = 35;
                    this[key][i + 2]['val'] = 35;
                }
            }
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['single'] > 0) {
                    if (key == 'z')
                        this[key][i]['val'] = 10;
                    else if (i == 1 || i == 9)
                        this[key][i]['val'] = 15;
                    else if (i == 2 || i == 8)
                        this[key][i]['val'] = 20;
                    else
                        this[key][i]['val'] = 25;
                }
            }
    }
    calcDora() {
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['dora'] > 0 || this[key][i]['redora'] > 0) {
                    this[key][i]['val'] += 20;
                }
            }
    }
    //public----------------------------------------
    newSingle(key, card) { //key:mpsz, card:1-9
        if (card == 0) { //red five
            this[key].redora++;
            card = 5;
        }
        this[key][card]['amount']++;
        this[key]['amount']++;
        //顺联
        if (key != 'z') {
            if (this[key][card - 1]['qian'] > 0) {
                this[key][card - 1]['qian']--;
                this[key]['qian']--;
                this[key]['shun']++;
                this[key][card - 1]['shun']++;
                this.refreshInfo();
                return;
            } //中崁
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
            if (card > 3 && this[key][card - 3]['qian'] > 0 && this[key][card + 1]['single'] > 0) {
                this[key][card - 3]['qian']--;
                this[key][card + 1]['single']--;
                this[key][card - 3]['signle']++;
                this[key][card - 1]['shun']++;
                this[key]['qian']--;
                this[key]['shun']++;
                this.refreshInfo();
                return;
            } //左崁跳单
            if (this[key][card + 1]['qian'] > 0 && this[key][card - 1]['single'] > 0) {
                this[key][card + 1]['qian']--;
                this[key][card - 1]['single']--;
                this[key][card + 3]['signle']++;
                this[key][card - 1]['shun']++;
                this[key]['qian']--;
                this[key]['shun']++;
                this.refreshInfo();
                return;
            } //左单跳崁
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
        }
        //刻子
        {
            if (this[key][card]['que'] > 0) {
                this[key][card]['que']--;
                this[key][card]['ke']++;
                this[key]['que']--;
                this[key]['ke']++;
                this.refreshInfo();
                return;
            } //本刻
        }
        //雀头
        {
            if (this[key][card]['single'] > 0) {
                this[key][card]['single']--;
                this[key][card]['que']++;
                this[key]['single']--;
                this[key]['que']++;
                this.refreshInfo();
                return;
            } //本雀
        }

        //连张
        if (key != 'z') {
            if (this[key][card - 1]['single'] > 0) {
                this[key][card - 1]['single']--;
                this[key][card - 1]['lian']++;
                this[key]['single']--;
                this[key]['lian']++;
                this.refreshInfo();
                return;
            } //左连
            if (this[key][card + 1]['single'] > 0) {
                this[key][card + 1]['single']--;
                this[key][card]['lian']++;
                this[key]['single']--;
                this[key]['lian']++;
                this.refreshInfo();
                return;
            } //右连
        }
        //middle of shun
        if (key != 'z') {
            if (this[key][card - 2]['single'] > 0) {
                this[key][card - 2]['single']--;
                this[key][card - 2]['qian']++;
                this[key]['single']--;
                this[key]['qian']++;
                this.refreshInfo();
                return;
            } //combine with left
            if (this[key][card + 2]['single'] > 0) {
                this[key][card + 2]['single']--;
                this[key][card]['qian']++;
                this[key]['single']--;
                this[key]['qian']++;
                this.refreshInfo();
                return;
            } //右嵌

        }
        //single
        {
            this[key][card]['single']++;
            this.refreshInfo();
        }
        return;
    }
    //ting pai
    isTing() {
        if (this.shun + this.ke == 4 ||
            this.que > 0 && this.shun + this.ke == 3 && this.que + this.qian + this.lian == 2)
            return true;
        if (this.qidui && this.que == 6)
            return true;
        if (this.guoshi && this.guoshiCards == 13)
            return true;
    }
    //he pai
    isHe() {
        if (this.shun + this.ke == 4 && this.que == 1)
            return true;
        if (this.qidui && this.que == 7)
            return true;
        if (this.guoshi && this.guoshiCards == 14)
            return true;
        return false;
    }
    deleteTile(key, card) {
        if (card == 5 && this[key][card]['redora'] > 0 && this[key][card]['amount'] == 1) {
            this[key][card]['redora'] = 0;
            this[key]['redora'] = 0;
        }
        if (this[key][card]['dora'] > 0) {
            this[key][card]['dora']--;
            this[key]['dora']--;
        }
        if (this[key][card]['single'] > 0) {
            this[key][card]['single']--;
            this[key]['single']--;
        } else if (this[key][card]['qian'] > 0 || this[key][card - 2]['qian'] > 0) {
            if (this[key][card]['qian'] > 0) {
                this[key][card]['qian']--;
                this[key][card + 2]['single']++;
                this[key]['qian']--;
                this[key]['single']++;
            } else {
                this[key][card - 2]['qian']--;
                this[key][card - 2]['single']++;
                this[key]['qian']--;
                this[key]['single']++;
            }
        } else if (this[key][card]['que'] > 0 && this['que'] > 1) {
            this[key][card]['que']--;
            this[key][card]['single']++;
            this[key]['que']--;
            this[key]['single']++;
        } else if (this[key][card]['lian'] > 0 || this[key][card - 1]['lian'] > 0) {
            if (this[key][card]['lian'] > 0) {
                this[key][card]['lian']--;
                this[key][card + 1]['single']++;
                this[key]['lian']--;
                this[key]['single']++;
            } else {
                this[key][card - 1]['lian']--;
                this[key][card - 1]['single']++;
                this[key]['lian']--;
                this[key]['single']++;
            }
        } else if (this[key][card]['que'] > 0) {
            this[key][card]['que']--;
            this[key][card]['single']++;
            this[key]['que']--;
            this[key]['single']++;
        } else if (this[key][card]['ke'] > 0) {
            this[key][card]['ke']--;
            this[key][card]['que']++;
            this[key]['ke']--;
            this[key]['que']++;
        } else {
            if (this[key][card - 2]['shun'] > 0) {
                this[key][card - 2]['shun']--;
                this[key][card - 1]['lian']++;
                this[key]['shun']--;
                this[key]['lian']++;
            } else if (this[key][card - 1]['shun'] > 0) {
                this[key][card - 1]['shun']--;
                this[key][card - 1]['qian']++;
                this[key]['shun']--;
                this[key]['qian']++;
            } else if (this[key][card]['shun'] > 0) {
                this[key][card]['shun']--;
                this[key][card + 1]['lian']++;
                this[key]['shun']--;
                this[key]['lian']++;
            }
        }
        this[key][card]['amount']--;
        this[key]['amount']--;
        this.refreshInfo();
    }
    //calc value，then remove worst
    removeWorstTile() {
        //init
        let minkey = 'z';
        let mincard = 1;
        let min = 100000000;
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++)
                this[key][i]['val'] = min;

        //add value
        this.calcXiangtingValue();
        this.calcDora();

        //find the worst value
        for (let key of cardTypes) {
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['val'] < min) {
                    minkey = key;
                    mincard = i;
                    min = this[key][i]['val'];
                }
            }
        }
        let res = mincard + minkey;
        if (mincard == 5 && this[minkey]['redora'] == 1 && this[minkey][mincard]['amount'] == 1)
            res = '0' + minkey;
        this.deleteTile(minkey, mincard);
        return res;
    }
    refreshInfo() {
        for (let type of recordTypes) {
            this[type] = 0;
            for (let key of cardTypes)
                this[type] += this[key][type];
        }
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
        console.log(str, this.normlXiangting());
    }
    normlXiangting() {
        let t = 0;
        t += 4 - this['shun'] - this['ke'];
        if (this['que'] == 0)
            t += 1;
        if (4 - this['shun'] - this['ke'] > this['lian'] + this['qian'] + (this['que'] > 0 ? this['que'] - 1 : 0)) {
            t += 4 - this['shun'] - this['ke'] - this['lian'] - this['qian'] - (this['que'] > 0 ? this['que'] - 1 : 0);
        }
        return t;
    }
}
class Handcard {
    constructor() {
        this.tileInfo = new TileInfo();
    }
    test() {
        console.log('----------------------------  test  ---------------------------');
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

            let key = this.getKey(tile);
            let card = parseInt(this.getCard(tile));

            this.tileInfo.newSingle(key, card);
            //console.log('');
            //console.log('insert tile:', tile);
            if (this.tileInfo['amount'] == 14) {
                if (this.tileInfo.isHe()) {
                    console.log('hule, use card: ', times + 1 - 13);
                    this.tileInfo.printDebug();
                    this.timeCost += (Date.now() - now);
                    break;
                } else {
                    let removeTile = this.tileInfo.removeWorstTile();
                    if (removeTile != tile) {
                        console.log('');
                        console.log('insert tile:', tile, 'remove tile: ', removeTile);
                        this.tileInfo.printDebug();
                    }
                    this.timeCost += (Date.now() - now);
                }
            }
        }
        console.log('avg time Cost(ms):', Math.floor(this.timeCost / times));
        return times - 13;
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

let insertTime = [];
for (let i = 0; i < 5; i++) {
    let s = hc.test();
    console.log('---------------------------- append cards: ', s, ' -----------------------------')
    insertTime.push(s);
}

console.log(insertTime);
debugger;