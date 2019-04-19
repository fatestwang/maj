const cardTypes = ['m', 'p', 's', 'z'];
const visiable = {
    m: '万',
    p: '筒',
    s: '条',
    z: '字'
};
const recordTypes = ['ke', 'shun', 'que', 'redora', 'dora', 'lian', 'qian', 'single', 'amount', 'remain'];

let getKey = function (tile) {
    return tile[1];
}
let getCard = function (tile) {
    return tile[0];
}
let getTile = function (key, card) {
    return card + key;
}
let tileIDToCode = function (tid) {
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
            for (let i = -2; i <= 11; i++) {
                this[key][i] = {};
                for (let type of recordTypes) {
                    this[key][i][type] = 0;
                }
                this[key][i]['remain'] = 4;
            }
    }
    //private-----------------------------------
    canCombineLeft(key, card) {
        if (this[key][card - 2]['lian'] > 0) return true;

        if (this[key][card - 1]['single'] + this[key][card - 1]['que'] + this[key][card - 1]['ke'] > 0 &&
            this[key][card - 2]['single'] + this[key][card - 2]['que'] + this[key][card - 2]['ke'] > 0 &&
            this[key][card - 1]['ke'] + this[key][card - 2]['ke'] != 2)
            return true;

        if (this[key][card - 1]['ke'] == this[key][card - 2]['ke'] && this[key][card - 1]['ke'] == 1) { // abbbcccd
        }

        if (card > 5 && this[key][card - 3]['shun'] > 0)
            return this.canCombineLeft(key, card - 3);
        return false;
    }
    doCombineLeft(key, card) {
        if (this[key][card - 2]['lian'] > 0) {
            this[key][card - 2]['lian']--;
            this[key][card - 2]['shun']++;
            return true;
        }

        if (this[key][card - 1]['single'] + this[key][card - 1]['que'] + this[key][card - 1]['ke'] > 0 &&
            this[key][card - 2]['single'] + this[key][card - 2]['que'] + this[key][card - 2]['ke'] > 0 &&
            this[key][card - 1]['ke'] + this[key][card - 2]['ke'] != 2) {

            this[key][card - 2]['shun']++;

            let leftQue = false;
            let llftQue = false;
            if (this[key][card - 1]['single'] > 0)
                this[key][card - 1]['single']--;
            else if (this[key][card - 1]['que'] > 0) {
                this[key][card - 1]['que']--;
                leftQue = true;
            } else if (this[key][card - 1]['ke'] > 0) {
                this[key][card - 1]['ke']--;
                this[key][card - 1]['que']++;
            }

            if (this[key][card - 2]['single'] > 0)
                this[key][card - 2]['single']--;
            else if (this[key][card - 2]['que'] > 0) {
                this[key][card - 2]['que']--;
                llftQue = true;
            } else if (this[key][card - 2]['ke'] > 0) {
                this[key][card - 2]['ke']--;
                this[key][card - 2]['que']++;
            }

            if (leftQue) this.insertTile(key, card - 1);
            if (llftQue) this.insertTile(key, card - 2);
            return true;
        }

        if (card > 5 && this[key][card - 3]['shun'] > 0) {
            this[key][card - 3]['shun']--;
            this[key][card - 2]['shun']++;
            return this.doCombineLeft(key, card - 3);
        }
        console.log('error combine left', card, key);
        return false;
    }
    canCombineRight(key, card) {
        if (this[key][card + 1]['lian'] > 0) return true;

        if (this[key][card + 1]['single'] + this[key][card + 1]['que'] + this[key][card + 1]['ke'] > 0 &&
            this[key][card + 2]['single'] + this[key][card + 2]['que'] + this[key][card + 2]['ke'] > 0 &&
            this[key][card + 1]['ke'] != this[key][card + 2]['ke'])
            return true;

        if (this[key][card + 1]['ke'] == this[key][card + 2]['ke'] && this[key][card + 1]['ke'] == 1) { // abbbcccd
        }

        if (card < 5 && this[key][card + 1]['shun'] > 0)
            return this.canCombineRight(key, card + 3);
        return false;
    }
    doCombineRight(key, card) {
        if (this[key][card + 1]['lian'] > 0) {
            this[key][card + 1]['lian']--;
            this[key][card]['shun']++;
            return true;
        }
        if (this[key][card + 2]['single'] + this[key][card + 2]['que'] + this[key][card + 2]['ke'] > 0 &&
            this[key][card + 1]['single'] + this[key][card + 1]['que'] + this[key][card + 1]['ke'] > 0 &&
            this[key][card + 2]['ke'] != this[key][card + 1]['ke']) {

            this[key][card + 1]['shun']++;

            let rightQue = false;
            let rrghtQue = false;
            if (this[key][card + 2]['single'] > 0)
                this[key][card + 2]['single']--;
            else if (this[key][card + 2]['que'] > 0) {
                this[key][card + 2]['que']--;
                rrghtQue = true;
            } else if (this[key][card + 2]['ke'] > 0) {
                this[key][card + 2]['ke']--;
                this[key][card + 2]['que']++;
            }

            if (this[key][card + 1]['single'] > 0)
                this[key][card + 1]['single']--;
            else if (this[key][card + 1]['que'] > 0) {
                this[key][card + 1]['que']--;
                rightQue = true;
            } else if (this[key][card + 1]['ke'] > 0) {
                this[key][card + 1]['ke']--;
                this[key][card + 1]['que']++;
            }
            if (rightQue) this.insertTile(key, card + 1);
            if (rrghtQue) this.insertTile(key, card + 2);
            return true;
        }

        if (card < 5 && this[key][card + 1]['shun'] > 0) {
            this[key][card + 1]['shun']--;
            this[key][card]['shun']++;
            return this.doCombineRight(key, card + 3);
        }
        console.log('error combine right', card, key);
        return false;
    }
    canCombinMiddle(key, card) {
        if (this[key][card - 1]['qian'] > 0)
            return true;
        if (this[key][card - 1]['single'] > 0) {
            if (this[key][card + 1]['que'] > 0 || this[key][card + 1]['ke'] > 0 || this[key][card + 1]['qian'] > 0)
                return true;
        }
        if (this[key][card + 1]['single'] > 0) {
            if (this[key][card - 1]['que'] > 0 || this[key][card - 1]['ke'] > 0 || this[key][card - 3]['qian'] > 0)
                return true;
        }
        if (this[key][card - 1]['que'] > 0 && this[key][card + 1]['que'] > 0)
            return true;
        return false;
    }
    doCombinMiddle(key, card) {
        if (this[key][card - 1]['qian'] > 0) {
            this[key][card - 1]['qian']--;
            this[key][card - 1]['shun']++;
            return;
        }
        if (this[key][card - 1]['single'] > 0) {
            if (this[key][card + 1]['que'] > 0) {
                this[key][card - 1]['single']--;
                this[key][card + 1]['que']--;
                this[key][card - 1]['shun']++;
                this.insertTile(key, card + 1);
                return;
            }
            if (this[key][card + 1]['qian'] > 0) {
                this[key][card - 1]['single']--;
                this[key][card + 1]['qian']--;
                this[key][card - 1]['shun']++;
                this.insertTile(key, card + 3);
                return;
            }
            if (this[key][card + 1]['ke'] > 0) {
                this[key][card - 1]['single']--;
                this[key][card + 1]['ke']--;
                this[key][card + 1]['que']++;
                this[key][card - 1]['shun']++;
                return;
            }
        }
        if (this[key][card + 1]['single'] > 0) {
            if (this[key][card - 1]['que'] > 0) {
                this[key][card + 1]['single']--;
                this[key][card - 1]['que']--;
                this[key][card - 1]['shun']++;
                this.insertTile(key, card - 1);
                return;
            }
            if (this[key][card - 3]['qian'] > 0) {
                this[key][card + 1]['single']--;
                this[key][card - 3]['qian']--;
                this[key][card - 1]['shun']++;
                this.insertTile(key, card - 3);
                return;
            }
            if (this[key][card - 1]['ke'] > 0) {
                this[key][card + 1]['single']--;
                this[key][card - 1]['ke']--;
                this[key][card - 1]['que']++;
                this[key][card - 1]['shun']++;
                return;
            }
        }

        if (this[key][card - 1]['que'] > 0 && this[key][card + 1]['que'] > 0) {
            this[key][card - 1]['que']--;
            this[key][card + 1]['que']--;
            this[key][card - 1]['shun']++;
            this.insertTile(key, card + 1);
            this.insertTile(key, card - 1);
            return;
        }
        console.log('error combine middle ', card, key);
        return;
    }
    canUpgradeKe(key, card) {
        if (this[key][card]['que'] > 0)
            return true;
    }
    doUpgradeKe(key, card) {
        if (this[key][card]['que'] > 0) {
            this[key][card]['que']--;
            this[key][card]['ke']++;
        } else {
            console.log('error upgrade ke', card, key);
            return false;
        }
    }
    canUpgradeQue(key, card) {
        if (this[key][card]['single'] > 0 ||
            this[key][card - 1]['lian'] > 0 ||
            this[key][card - 2]['qian'] > 0 ||
            this[key][card]['qian'] > 0 ||
            this[key][card]['lian'] > 0)
            return true;
        return false;
    }
    doUpgradeQue(key, card) {
        if (this[key][card]['single'] > 0) {
            this[key][card]['single']--;
            this[key][card]['que']++;
            this.refreshInfo();
            return;
        }
        if (this[key][card]['qian'] > 0) {
            this[key][card]['qian']--;
            this[key][card]['que']++;
            this.refreshInfo();
            this.insertTile(key, card + 2);
            return;
        }
        if (this[key][card - 2]['qian'] > 0) {
            this[key][card - 2]['qian']--;
            this[key][card]['que']++;
            this.refreshInfo();
            this.insertTile(key, card - 2);
            return;
        }
        if (this[key][card]['lian'] > 0) {
            this[key][card]['lian']--;
            this[key][card]['que']++;
            this.refreshInfo();
            this.insertTile(key, card + 1);
            return;
        }
        if (this[key][card - 1]['lian'] > 0) {
            this[key][card - 1]['lian']--;
            this[key][card]['que']++;
            this.refreshInfo();
            this.insertTile(key, card - 1);
            return;
        }
        console.log('error, cannot upgrade que,', card, key);
        return;
    }

    calcPatternSingle(key, card){
        if(key =='z'){

        }
    }
    calcPatternValue() {
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++)
                if (this[key][i]['amount'] > 0) {
                    this[key][i]['val'] = 0;

                    if (this[key][i]['shun'] > 0 || this[key][i-1]['shun'] > 0 || this[key][i-2]['shun'] > 0) {
                        this[key][i]['val'] = 625;
                    }

                    if (this[key][i]['ke'] > 0){ 
                        if(this['que'] > 0) 
                            this[key][i]['val'] = 625;
                        else 
                            this[key][i]['val'] = calcPatternSingle(key, card);
                    }

                    if (this[key][i]['lian'] > 0) {
                        this[key][i]['val'] = Math.min(this[key][i]['val'], (this[key][i - 1]['remain'] + this[key][i + 2]['remain']) / this['remain']);
                        this[key][i + 1]['val'] = Math.min(this[key][i + 1]['val'], (this[key][i - 1]['remain'] + this[key][i + 2]['remain']) / this['remain']);
                    }
                    if (this[key][i]['que'] > 0) {
                        if (this['que'] == 1)
                            this[key][i]['val'] = Math.min(this[key][i]['val'], 100);
                        else
                            this[key][i]['val'] = Math.min(this[key][i]['val'], this[key][i]['remain'] / this['remain']);
                    }
                    if (this[key][i]['qian'] > 0) {
                        this[key][i]['val'] = Math.min(this[key][i]['val'], this[key][i + 1]['remain'] / this['remain']);
                        this[key][i + 2]['val'] = Math.min(this[key][i + 2]['val'], this[key][i + 1]['remain'] / this['remain']);
                    }
                    if (this[key][i]['single'] > 0) {
                        if (key == 'z')
                            this[key][i]['val'] = Math.min(this[key][i]['val'], this[key][i]['remain'] / this['remain'] / this['remain']);
                        else {
                            let needs = this[key][i - 2]['remain'] + this[key][i - 1]['remain'] +
                                this[key][i]['remain'] + this[key][i + 1]['remain'] +
                                this[key][i + 2]['remain'];
                            this[key][i]['val'] = Math.min(this[key][i]['val'], needs / this['remain'] * needs / this['remain']);
                        }
                    }
                }
    }
    calcDora() {
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['dora'] > 0 || this[key][i]['redora'] > 0 && this[key][i]['amount'] == 1) {
                    this[key][i]['val'] += 20;
                }
            }
    }
    calcValue(){
        for (let key of cardTypes)
        for (let i = 1; i < 10; i++)
            if (this[key][i]['amount'] > 0)
                this[key][i]['val'] = this[key][i]['normal'] + this[key][i]['upgrade'] * 25
    }
    addAmount(key, card) {
        if (this[key][card]['amount'] >= 4) {
            console.log('error, add Amount but is bigger than 4.');
            return;
        }
        this[key][card]['amount']++;
    }
    reduceAmount(key, card) {
        if (this[key][card]['amount'] <= 0) {
            console.log('error: reduce card but no one remain.');
            return;
        }
        this[key][card]['amount']--;
    }
    reduceRemain(key, card) {
        if (this[key][card]['remain'] <= 0) {
            console.log('error: reduce card but no one remain.');
            return;
        }
        this[key][card]['remain']--;

    }
    //public----------------------------------------
    newSingle(key, card) {
        if (card == 0) { //red five
            this[key][card]['redora']++;
            card = 5;
        }
        this.addAmount(key, card);
        this.reduceRemain(key, card);
        this.insertTile(key, card);
        this.refreshInfo();
    }
    insertTile(key, card) { //key:mpsz, card:1-9
        if (key != 'z') {
            if (this.canCombineLeft(key, card)) {
                this.doCombineLeft(key, card);
                return;
            } else if (this.canCombineRight(key, card)) {
                this.doCombineRight(key, card);
                return;
            } else if (this.canCombinMiddle(key, card)) {
                this.doCombinMiddle(key, card);
                return;
            }
        } {
            if (this.canUpgradeKe(key, card)) {
                this.doUpgradeKe(key, card);
                return;
            }
        }
        //雀头
        if (this.canUpgradeQue(key, card)) {
            this.doUpgradeQue(key, card);
            return;
        }
        //连张
        if (key != 'z') {
            if (this[key][card - 1]['single'] > 0) {
                this[key][card - 1]['single']--;
                this[key][card - 1]['lian']++;
                return;
            } //左连
            if (this[key][card + 1]['single'] > 0) {
                this[key][card + 1]['single']--;
                this[key][card]['lian']++;
                return;
            } //右连
        }
        //middle of shun
        if (key != 'z') {
            if (this[key][card - 2]['single'] > 0) {
                this[key][card - 2]['single']--;
                this[key][card - 2]['qian']++;
                return;
            } //combine with left
            if (this[key][card + 2]['single'] > 0) {
                this[key][card + 2]['single']--;
                this[key][card]['qian']++;
                return;
            } //右嵌

        }
        //single
        {
            this[key][card]['single']++;
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
        }
        this[key][card]['amount']--;
        this.resetTile(key, card);
        this.refreshInfo();
    }
    resetTile(key, card) {
        if (this[key][card]['single'] > 0) {
            this[key][card]['single']--;
            return;
        }
        if (this[key][card]['qian'] > 0) {
            this[key][card]['qian']--;
            this.insertTile(key, card + 2);
            return;
        }
        if (this[key][card - 2]['qian'] > 0) {
            this[key][card - 2]['qian']--;
            this.insertTile(key, card - 2);
            return;
        }
        if (this[key][card]['lian'] > 0) {
            this[key][card]['lian']--;
            this.insertTile(key, card + 1);
            return;
        }
        if (this[key][card - 1]['lian'] > 0) {
            this[key][card - 1]['lian']--;
            this.insertTile(key, card - 1);
            return;
        }
        if (this[key][card]['que'] > 0) {
            this[key][card]['que']--;
            this.insertTile(key, card);
            return;
        }
        if (this[key][card]['ke'] > 0) {
            this[key][card]['ke']--;
            this.insertTile(key, card);
            this.insertTile(key, card);
            return;
        }
        if (this[key][card - 2]['shun'] > 0) {
            this[key][card - 2]['shun']--;
            this.insertTile(key, card - 1);
            this.insertTile(key, card - 2);
            return;
        }
        if (this[key][card - 1]['shun'] > 0) {
            this[key][card - 1]['shun']--;
            this.insertTile(key, card - 1);
            this.insertTile(key, card + 1);
            return;
        }
        if (this[key][card]['shun'] > 0) {
            this.insertTile(key, card + 1);
            this.insertTile(key, card + 2);
            return;
        }
        console.log('error: cannot find this tile!');
        return false;
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
        this.calcPatternValue();
        this.calcDora();
        this.calcValue();
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
        for (let key of cardTypes)
            for (let type of recordTypes) {
                this[key][type] = 0;
                for (let i = 1; i < 10; i++)
                    this[key][type] += this[key][i][type];
            }
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
        return str + ' ' + this.normlXiangting();
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
        let logger = {
            number: 0,
            log: [],
        }
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
            let tile = tileIDToCode(list[times]);

            let key = getKey(tile);
            let card = parseInt(getCard(tile));

            this.tileInfo.newSingle(key, card);
            logger.number++;
            //console.log('');
            //console.log('insert tile:', tile);
            if (this.tileInfo['amount'] == 14) {
                if (this.tileInfo.isHe()) {
                    logger.log.push('hule, insert tile: ' + tile + '  use card: ' + (times + 1 - 13));
                    logger.log.push(this.tileInfo.printDebug());
                    this.timeCost += (Date.now() - now);
                    break;
                } else {
                    let removeTile = this.tileInfo.removeWorstTile();
                    if (removeTile != tile) {
                        logger.log.push('insert tile: ' + tile + '  remove tile: ' + removeTile + '  index: ' + times);
                        logger.log.push('amount: ' + this.tileInfo['amount']);
                        logger.log.push(this.tileInfo.printDebug());
                    }
                    this.timeCost += (Date.now() - now);
                }
            }
        }
        logger.log.push('avg time Cost(ms):', Math.floor(this.timeCost / times));
        return logger;
    }

    singleTest(list) {
        console.log('----------------------------  single test  ---------------------------');
        this.tileInfo = new TileInfo();
        for (let times = 0; times < 14; times++) {
            let tile = list[times];

            let key = getKey(tile);
            let card = parseInt(getCard(tile));
            if (times == 13)
                debugger;
            this.tileInfo.newSingle(key, card);
            //console.log('');
            //console.log('insert tile:', tile);
            if (this.tileInfo['amount'] == 14) {
                if (this.tileInfo.isHe()) {
                    console.log('hule, insert tile: ', tile, ' use card: ', times + 1 - 13);
                    console.log(this.tileInfo.printDebug());
                    break;
                } else {
                    let removeTile = this.tileInfo.removeWorstTile();
                    console.log('');
                    console.log('insert tile:', tile, 'remove tile: ', removeTile);
                    console.log(this.tileInfo.printDebug());
                }
            }
        }
    }
}

let hc = new Handcard();



let insertTime = [];
let log = [];
let runtimes = 5;
let sum = 0;
for (let i = 0; i < runtimes; i++) {
    let s = hc.test();
    if (s.number > 130)
        console.log(s.log);
    log.push(s.log)
    insertTime.push(s.number);
    sum += s.number;
}
console.log(insertTime);
console.log(sum / runtimes);
debugger;

//2筒4筒*1 5筒*1 7筒9筒*1 3条*1 9条*1 3字*1 4字*1 5字5字*1 6字*1 7字*1 
let sample = ['2p', '4p', '5p', '7p', '9p', '3s', '9s', '3z', '4z', '5z', '6z', '7z', '5z', '6p'];
//hc.singleTest(sample);