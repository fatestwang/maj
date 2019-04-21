const {TileInfo} = require('../code/TileInfo')
const XIANG_TING_VALUE = 25;
const DOUBLE_XT_VALUE = 625;
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
    return parseInt(tile[0]);
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
        for (let times = 0; times < 136; times++) {
            if(times == 124) {
                logger.number = -1;
                break;
            }
            let now = Date.now();
            let tile = tileIDToCode(list[times]);

            let key = getKey(tile);
            let card = parseInt(getCard(tile));

            this.tileInfo.reduceRemain(tile);
            this.tileInfo.newCard(key, card, times % 4);
            //console.log('');
            //console.log('insert tile:', tile);
            if (this.tileInfo['amount'] == 14) {
                logger.number++;
                if (this.tileInfo.isHe()) {
                    logger.log.push('hule, insert tile: ' + tile + '  use card: ' + (times + 1 - 13));
                    logger.log.push(...this.tileInfo.printDebug());
                    this.timeCost += (Date.now() - now);
                    break;
                } else {
                    let removeTile = this.tileInfo.removeWorstTile();
                    logger.log.push('insert tile: ' + tile + '  remove tile: ' + removeTile + '  index: ' + (Math.floor((times - 13) / 4) + 1));
                    logger.log.push('amount: ' + this.tileInfo['amount']);
                    logger.log.push(...this.tileInfo.printDebug());
                    this.timeCost += (Date.now() - now);
                }
            }
        }
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
                    console.log(...this.tileInfo.printDebug());
                    break;
                } else {
                    let removeTile = this.tileInfo.removeWorstTile();
                    console.log('');
                    console.log('insert tile:', tile, 'remove tile: ', removeTile);
                    console.log(...this.tileInfo.printDebug());
                }
            }
        }
    }
}

let hc = new Handcard();

let insertTime = [];
let log = [];
let runtimes = 10;
let sum = 0;
let heTimes = 0;
for (let i = 0; i < runtimes; i++) {
    let s = hc.test();
    if (s.number > 130)
        console.log(s.log);
    log.push(s.log)
    insertTime.push(s.number);
    if(s.number>=0){
        sum += s.number;
        heTimes ++;
    }
}

console.log(insertTime);
console.log('和牌效率', sum / heTimes,' 和牌次数:', heTimes,' 模拟次数:',runtimes);
debugger;

//4万5万6万*1 6万7万8万*1 5条6条7条*1 5条*1 7条8条9条*1 6s
let sample = ['1p','3p','4p','5p','7p','9p','1s','7s','5s','7s','9s','3z','6z','2s'];
hc.singleTest(sample);