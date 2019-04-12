const cardTypes = ['m', 'p', 's', 'z'];
const recordTypes = ['tiles', 'ke', 'shun', 'que', 'redora', 'dora', 'lian', 'kan', 'single'];
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
            for (let i = -1; i < 11; i++) {
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
            this.tileInfo[key].redora++;
            card = 5;
        }
        if (key != 'z') {
            if (this[key][card - 2]['lian'] > 0) {
                this[key][card - 2]['lian']--;
                this[key]['lian']--;
                this[key]['shun']++;
                this[key][card - 2]['shun']++;
                this.refreshInfo();
                return;
            }
            if (this[key][card + 1]['lian'] > 0) {
                this[key][card + 1]['lian']--;
                this[key]['lian']--;
                this[key]['shun']++;
                this[key][card]['shun']++;
                this.refreshInfo();
                return;
            }
            if (this[key][card - 1]['kan'] > 0) {
                this[key][card - 1]['kan']--;
                this[key]['kan']--;
                this[key]['shun']++;
                this[key][card - 1]['kan']++;
                this.refreshInfo();
                return;
            }
            if (card < 5 && this[key][card + 1]['shun'] > 0 && this[key][card + 4]['lian'] > 0) {
                this[key][card + 1]['shun']--;
                this[key][card + 4]['lian']--;
                this[key][card]['shun']++;
                this[key][card + 3]['shun']++;
                this[key]['lian']--;
                this[key]['shun']++;
                this.refreshInfo();
                return;
            }
        }


    }
}
class Handcard {
    constructor() {
        this.tileInfo = new TileInfo();
    }
    insertTile(tileInfo) {
        let key = this.getKey(tileInfo);
        let card = this.getCard(tileInfo);
        this.tileInfo.newSingle(key, card);
    }
    findWorstTile() {

    }
    deleteTile(tileInfo) {

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
            this.insertTile(this.tileIDToCode(list[times]));
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