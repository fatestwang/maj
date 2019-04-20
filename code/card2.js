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
    canCombineLeftLian(key, card) {
        if (this[key][card - 1]['single'] > 0 || this[key][card - 1]['ke'] > 0)
            return true;
        if (key > 3 && this[key][card - 3]['qian'] > 0)
            return true;
        if (key > 2 && this[key][card - 2]['lian'] > 0)
            return true;
        // if (this[key][card]['que'] > 0 || this[key][card + 1]['que'] > 0)
        //     return true;
        if (card > 5 && this[key][card - 3]['shun'] > 0)
            return this.canCombineLeftLian(key, card - 3);
        return false;
    }
    doCombineLeftLian(key, card) {
        if (this[key][card - 1]['single'] > 0 || this[key][card - 1]['ke'] > 0) {
            this[key][card - 1]['shun']++;
            if (this[key][card - 1]['single'] > 0) {
                this[key][card - 1]['single']--;
            } else {
                this[key][card - 1]['ke']--;
                this[key][card - 1]['que']++;
            }
            this.refreshInfo();
            return;
        }
        if (key > 3 && this[key][card - 3]['qian'] > 0) {
            this[key][card - 1]['shun']++;
            this[key][card - 3]['qian']--;
            this[key][card - 3]['single']++;
            this.refreshInfo();
            return;
        }
        if (key > 2 && this[key][card - 2]['lian'] > 0) {
            this[key][card - 1]['shun']++;
            this[key][card - 2]['lian']--;
            this[key][card - 2]['single']++;
            this.refreshInfo();
            return;
        }
        if (card > 5 && this[key][card - 3]['shun'] > 0) {
            this[key][card - 1]['shun']++;
            this[key][card - 3]['shun']--;
            return this.doCombineLeftLian(key, card - 3);
        }
        console.log('error, combine left lian', key, card);
        debugger;
        return;
    }
    canCombineRightLian(key, card) {
        if (this[key][card + 2]['single'] > 0 || this[key][card + 2]['ke'] > 0)
            return true;
        if (key < 6 && this[key][card + 2]['qian'] > 0)
            return true;
        if (key < 7 && this[key][card + 2]['lian'] > 0)
            return true;
        // if (this[key][card]['que'] > 0 || this[key][card + 1]['que'] > 0)
        //     return true;
        if (card < 5 && this[key][card + 2]['shun'] > 0)
            return this.canCombineLeftLian(key, card + 3);
        return false;
    }
    doCombineRightLian(key, card) {
        if (this[key][card + 2]['single'] > 0 || this[key][card + 2]['ke'] > 0) {
            this[key][card]['shun']++;
            if (this[key][card + 2]['single'] > 0) {
                this[key][card + 2]['single']--;
            } else {
                this[key][card + 2]['ke']--;
                this[key][card + 2]['que']++;
            }
            this.refreshInfo();
            return;
        }
        if (key < 6 && this[key][card + 2]['qian'] > 0) {
            this[key][card]['shun']++;
            this[key][card + 2]['qian']--;
            this[key][card + 4]['single']++;
            this.refreshInfo();
            return;
        }
        if (key > 2 && this[key][card + 2]['lian'] > 0) {
            this[key][card]['shun']++;
            this[key][card + 2]['lian']--;
            this[key][card + 3]['single']++;
            this.refreshInfo();
            return;
        }
        if (card < 5 && this[key][card + 3]['shun'] > 0) {
            this[key][card]['shun']++;
            this[key][card + 3]['shun']--;
            return this.doCombineLeftLian(key, card + 3);
        }
        console.log('error, combine left lian', key, card);
        debugger;
        return;
    }
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
            this.refreshInfo();
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
            this.refreshInfo();

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
        debugger;
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
            this.refreshInfo();
            return true;
        }
        if (this[key][card + 2]['single'] + this[key][card + 2]['que'] + this[key][card + 2]['ke'] > 0 &&
            this[key][card + 1]['single'] + this[key][card + 1]['que'] + this[key][card + 1]['ke'] > 0 &&
            this[key][card + 2]['ke'] != this[key][card + 1]['ke']) {

            this[key][card]['shun']++;

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
            this.refreshInfo();
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
        debugger;
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
            this.refreshInfo();
            return;
        }
        if (this[key][card - 1]['single'] > 0) {
            if (this[key][card + 1]['que'] > 0) {
                this[key][card - 1]['single']--;
                this[key][card + 1]['que']--;
                this[key][card - 1]['shun']++;
                this.refreshInfo();
                this.insertTile(key, card + 1);
                return;
            }
            if (this[key][card + 1]['qian'] > 0) {
                this[key][card - 1]['single']--;
                this[key][card + 1]['qian']--;
                this[key][card - 1]['shun']++;
                this.refreshInfo();
                this.insertTile(key, card + 3);
                return;
            }
            if (this[key][card + 1]['ke'] > 0) {
                this[key][card - 1]['single']--;
                this[key][card + 1]['ke']--;
                this[key][card + 1]['que']++;
                this[key][card - 1]['shun']++;
                this.refreshInfo();
                return;
            }
        }
        if (this[key][card + 1]['single'] > 0) {
            if (this[key][card - 1]['que'] > 0) {
                this[key][card + 1]['single']--;
                this[key][card - 1]['que']--;
                this[key][card - 1]['shun']++;
                this.refreshInfo();
                this.insertTile(key, card - 1);
                return;
            }
            if (this[key][card - 3]['qian'] > 0) {
                this[key][card + 1]['single']--;
                this[key][card - 3]['qian']--;
                this[key][card - 1]['shun']++;
                this.refreshInfo();
                this.insertTile(key, card - 3);
                return;
            }
            if (this[key][card - 1]['ke'] > 0) {
                this[key][card + 1]['single']--;
                this[key][card - 1]['ke']--;
                this[key][card - 1]['que']++;
                this[key][card - 1]['shun']++;
                this.refreshInfo();
                return;
            }
        }

        if (this[key][card - 1]['que'] > 0 && this[key][card + 1]['que'] > 0) {
            this[key][card - 1]['que']--;
            this[key][card + 1]['que']--;
            this[key][card - 1]['shun']++;
            this.refreshInfo();
            this.insertTile(key, card + 1);
            this.insertTile(key, card - 1);
            return;
        }
        console.log('error combine middle ', card, key);
        debugger;
        return;
    }
    canLianLeft(key, card) {
        if (this[key][card - 1]['single'] > 0)
            return true;
        if (this[key][card - 3]['shun'] > 0)
            return this.canLianLeft(key, card - 3);
        return false;
    }
    doLianLeft(key, card) {
        if (this[key][card - 1]['single'] > 0) {
            this[key][card - 1]['single']--;
            this[key][card - 1]['lian']++;
            this.refreshInfo();
            return;
        }
        if (this[key][card - 3]['shun'] > 0) {
            this[key][card - 3]['shun']--;
            this[key][card - 2]['shun']++;
            this.doLianLeft(key, card - 3);
            return;
        }
        console.log('error do lian left', key, card);
        debugger;
        return;
    }
    canLianRight(key, card) {
        if (this[key][card + 1]['single'] > 0)
            return true;
        if (this[key][card + 1]['shun'] > 0)
            return this.canLianRight(key, card + 3);
        return false;
    }
    doLianRight(key, card) {
        if (this[key][card + 1]['single'] > 0) {
            this[key][card + 1]['single']--;
            this[key][card]['lian']++;
            this.refreshInfo();
            return;
        }
        if (this[key][card + 1]['shun'] > 0) {
            this[key][card + 1]['shun']--;
            this[key][card]['shun']++;
            this.doLianRight(key, card + 3);
            return;
        }
        console.log('error do lian right', key, card);
        debugger;
        return;
    }
    canQianLeft(key, card) {
        if (this[key][card - 2]['single'] > 0)
            return true;
        if (this[key][card - 3]['shun'] > 0)
            return this.canQianLeft(key, card - 3);
        return false;

    }
    doQianLeft(key, card) {
        if (this[key][card - 2]['single'] > 0) {
            this[key][card - 2]['single']--;
            this[key][card - 2]['qian']++;
            this.refreshInfo();
            return;
        }
        if (this[key][card - 2]['single'] > 0 && this[key][card - 3]['shun'] > 0) { //special!!:ABBC,add D
            this[key][card - 2]['single']--;
            this[key][card - 3]['shun']--;
            this[key][card - 2]['shun']++;
            this[key][card - 3]['lian']++;
            this.refreshInfo();
            return;
        }
        if (this[key][card - 3]['shun'] > 0) {
            this[key][card - 3]['shun']--;
            this[key][card - 2]['shun']++;
            this.doQianLeft(key, card - 3);
            return;
        }
        console.log('error do qian left', key, card);
        debugger;
        return;
    }
    canQianRight(key, card) {
        if (this[key][card + 2]['single'] > 0)
            return true;
        if (this[key][card + 1]['shun'] > 0)
            return this.canQianRight(key, card + 3);
        return false;

    }
    doQianRight(key, card) {
        if (this[key][card + 2]['single'] > 0) {
            this[key][card + 2]['single']--;
            this[key][card]['qian']++;
            this.refreshInfo();
            return;
        }
        if (this[key][card + 2]['single'] > 0 && this[key][card + 1]['shun'] > 0) { //special!!:BCCD,add A
            this[key][card + 2]['single']--;
            this[key][card + 1]['shun']--;
            this[key][card]['shun']++;
            this[key][card + 2]['lian']++;
            this.refreshInfo();
            return;
        }
        if (this[key][card + 1]['shun'] > 0) {
            this[key][card + 1]['shun']--;
            this[key][card]['shun']++;
            this.doQianRight(key, card + 3);
            return;
        }
        console.log('error do qian left', key, card);
        debugger;
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
            this.refreshInfo();
            return;
        }
        console.log('error upgrade ke', card, key);
        debugger;
        return;
    }
    canUpgradeQue(key, card) {
        if (this[key][card]['single'] > 0 ||
            this[key][card - 1]['lian'] > 0 ||
            this[key][card - 2]['qian'] > 0 ||
            this[key][card]['qian'] > 0 ||
            this[key][card]['lian'] > 0)
            return true;
        if (this[key][card]['shun'] > 0 && this.canCombineRightLian(key, card + 1))
            return true;
        if (this[key][card - 2]['shun'] > 0 && this.canCombineLeftLian(key, card - 2))
            return true;

        if (this[key][card - 1]['shun'] > 0 && this.canCombineLeft(key, card - 1))
            return true;
        if (this[key][card - 1]['shun'] > 0 && this.canCombineRight(key, card + 1))
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
        if (this[key][card]['shun'] > 0 && this.canCombineRightLian(key, card + 1)) {
            this[key][card]['shun']--;
            this[key][card]['que']++;
            this.refreshInfo();
            this.doCombineRightLian(key, card + 1);
            return;
        }
        if (this[key][card - 2]['shun'] > 0 && this.canCombineLeftLian(key, card - 2)) {
            this[key][card - 2]['shun']--;
            this[key][card]['que']++;
            this.refreshInfo();
            this.doCombineLeftLian(key, card - 2);
            return;
        }
        if (this[key][card - 1]['shun'] > 0 && this.canCombineLeft(key, card - 1)) {
            this[key][card - 1]['shun']--;
            this[key][card]['que']++;
            this.refreshInfo();
            this.doCombineLeft(key, card - 1);
            this.insertTile(key, card + 1);
            return;
        }
        if (this[key][card - 1]['shun'] > 0 && this.canCombineRight(key, card + 1)) {
            this[key][card - 1]['shun']--;
            this[key][card]['que']++;
            this.refreshInfo();
            this.doCombineRight(key, card + 1);
            this.insertTile(key, card - 1);
            return;
        }

        console.log('error, cannot upgrade que,', card, key);
        debugger;
        return;
    }


    calcPatternValue() {
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                this[key][i]['one'] = false;
                this[key][i]['two'] = false;
                this[key][i]['three'] = false;
            }
        let NotEC = this['ke'] + this['shun'] + this['que'] + this['lian'] + this['qian'] <= 4;
        let NoQue = this['que'] == 0;
        let OneQue = this['que'] == 1;
        let twoQue = this['que'] == 2;
        let twoOrMoreQue = this['que'] > 1;
        let threeOrMoreQue = this['que'] > 2;
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['single'] > 0) {
                    if (NoQue || NotEC)
                        this[key][i]['one'] |= true;
                    this[key][i]['two'] |= true;
                    if (key != 'z') {
                        this[key][i - 2]['two'] |= true;
                        this[key][i - 1]['two'] |= true;
                        this[key][i + 1]['two'] |= true;
                        this[key][i + 2]['two'] |= true;
                    }
                }
                if (this[key][i]['qian'] > 0) {
                    this[key][i + 1]['one'] |= true;

                    this[key][i - 2]['two'] |= true;
                    this[key][i - 1]['two'] |= true;
                    this[key][i]['two'] |= true;
                    this[key][i + 2]['two'] |= true;
                    this[key][i + 3]['two'] |= true;
                    this[key][i + 4]['two'] |= true;

                }
                if (this[key][i]['lian'] > 0) {
                    this[key][i - 1]['one'] |= true;
                    this[key][i + 2]['one'] |= true;

                    this[key][i]['two'] |= true;
                    this[key][i + 1]['two'] |= true;
                    this[key][i - 2]['two'] |= true;
                    this[key][i + 3]['two'] |= true;
                }
                if (this[key][i]['que'] > 0) {
                    this[key][i]['one'] |= !OneQue;
                    this[key][i]['two'] |= OneQue;
                    if (this[key][i - 1]['que'] > 0) { //AABB
                        this[key][i - 2]['one'] |= threeOrMoreQue;
                        this[key][i + 1]['one'] |= threeOrMoreQue;
                        this[key][i - 2]['two'] |= twoQue;
                        this[key][i + 1]['two'] |= twoQue;
                    }
                    if (this[key][i - 2]['que'] > 0) { //AACC
                        this[key][i - 1]['one'] |= threeOrMoreQue;
                        this[key][i - 1]['one'] |= twoQue;
                    }
                    if (this[key][i - 1]['single'] > 0) { //ABB
                        this[key][i - 2]['one'] |= twoOrMoreQue;
                        this[key][i + 1]['one'] |= twoOrMoreQue;
                    }
                    if (this[key][i - 2]['single'] > 0) { //ACC
                        this[key][i - 1]['one'] |= twoOrMoreQue;
                    }
                    if (this[key][i + 1]['single'] > 0) { //BBC
                        this[key][i - 1]['one'] |= twoOrMoreQue;
                        this[key][i + 2]['one'] |= twoOrMoreQue;
                    }
                    if (this[key][i + 2]['single'] > 0) { //AAC
                        this[key][i + 1]['one'] |= twoOrMoreQue;
                    }
                }
            }
        let one = 0;
        let two = 0;
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['one'])
                    one += this[key][i]['remain'];
                else if (this[key][i]['two'])
                    two += this[key][i]['remain'];
            }
        let t = this.normlXiangting();
        return (9 - t) * DOUBLE_XT_VALUE + one * XIANG_TING_VALUE + two;
    }
    calcValue() {
        let value = 0;
        //叠加牌型价值
        value += this.calcPatternValue();
        //dora 价值

        //番价值

        //防御价值
        return value;

    }
    calcDora() {
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['dora'] > 0 || this[key][i]['redora'] > 0 && this[key][i]['amount'] == 1) {
                    this[key][i]['val'] += 20;
                }
            }
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
    newCard(key, card , place){
        if(place == 0){
            this.newSingle(key, card);
        }
        else{//别人打出的牌

        }
    }
    newSingle(key, card) {
        this.deeper = 0;
        if (card == 0) { //red five
            this[key][card]['redora']++;
            card = 5;
        }
        this.addAmount(key, card);
        this.insertTile(key, card);
    }
    insertTile(key, card) { //key:mpsz, card:1-9
        this.deeper++;
        if (this.deeper > 10) {
            debugger;
        }
        if (key != 'z') {
            if (this.canCombineLeft(key, card)) {
                this.doCombineLeft(key, card);
                return;
            }
            if (this.canCombineRight(key, card)) {
                this.doCombineRight(key, card);
                return;
            }
            if (this.canCombinMiddle(key, card)) {
                this.doCombinMiddle(key, card);
                return;
            }
        }
        if (this.canUpgradeKe(key, card)) {
            this.doUpgradeKe(key, card);
            return;

        }
        //雀头
        if (this.canUpgradeQue(key, card)) {
            this.doUpgradeQue(key, card);
            return;
        }
        //lian
        if (key != 'z') {
            if (this.canLianLeft(key, card)) {
                this.doLianLeft(key, card);
                return;
            }
            if (this.canLianRight(key, card)) {
                this.doLianRight(key, card);
                return;
            }
        }
        //qian
        if (key != 'z') {
            if (this.canQianLeft(key, card)) {
                this.doQianLeft(key, card);
                return;
            }
            if (this.canQianRight(key, card)) {
                this.doQianRight(key, card);
                return;
            }
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
        let res = card + key;

        if (this[key][card]['amount'] == 0) {
            debugger;
            return res;
        }
        if (card == 5 && this[key][card]['redora'] > 0 && this[key][card]['amount'] == 1) {
            this[key][card]['redora'] = 0;
            res = '0' + key;
        }
        if (this[key][card]['dora'] > 0) {
            this[key][card]['dora']--;
        }

        if (this[key][card]['single'] > 0) {
            this[key][card]['single']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            return res;
        }
        if (this[key][card]['qian'] > 0) {
            this[key][card]['qian']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            this.insertTile(key, card + 2);
            return res;;
        }
        if (this[key][card - 2]['qian'] > 0) {
            this[key][card - 2]['qian']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            this.insertTile(key, card - 2);
            return res;;
        }
        if (this[key][card]['lian'] > 0) {
            this[key][card]['lian']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            this.insertTile(key, card + 1);
            return res;;
        }
        if (this[key][card - 1]['lian'] > 0) {
            this[key][card - 1]['lian']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            this.insertTile(key, card - 1);
            return res;;
        }
        if (this[key][card]['que'] > 0) {
            this[key][card]['que']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            this.insertTile(key, card);
            return res;;
        }
        if (this[key][card]['ke'] > 0) {
            this[key][card]['ke']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            this.insertTile(key, card);
            this.insertTile(key, card);
            return res;;
        }
        if (this[key][card - 2]['shun'] > 0) {
            this[key][card - 2]['shun']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            this.insertTile(key, card - 1);
            this.insertTile(key, card - 2);
            return res;;
        }
        if (this[key][card - 1]['shun'] > 0) {
            this[key][card - 1]['shun']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            this.insertTile(key, card - 1);
            this.insertTile(key, card + 1);
            return res;;
        }
        if (this[key][card]['shun'] > 0) {
            this[key][card]['shun']--;
            this[key][card]['amount']--;
            this.refreshInfo();
            this.insertTile(key, card + 1);
            this.insertTile(key, card + 2);
            return res;;
        }
        console.log(key, card);
        debugger;
        return res;
    }
    //calc value，then remove worst
    removeWorstTile() {
        //init
        let maxkey = 'z';
        let maxcard = 0;
        let max = 0;
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++)
                this[key][i]['val'] = 0;
        //calc value
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++)
                if (this[key][i]['amount'] > 0) {
                    let tile = this.deleteTile(key, i);
                    this[key][i]['val'] = this.calcValue();
                    this.newSingle(getKey(tile), getCard(tile));
                }
        //find the worst value
        for (let key of cardTypes) {
            for (let i = 1; i < 10; i++) {
                if (this[key][i]['amount'] > 0 && this[key][i]['val'] > max) {
                    maxkey = key;
                    maxcard = i;
                    max = this[key][i]['val'];
                }
            }
        }

        return this.deleteTile(maxkey, maxcard);
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
        let debugStr = '';
        for (let key of cardTypes)
            for (let i = 1; i < 10; i++)
                for (let k = 0; k < this[key][i]['amount']; k++)
                    debugStr += '\'' + i + key + '\',';
        let valStr = '';
        for (let key of cardTypes) {
            let keyStr = visiable[key];
            for (let i = 1; i < 10; i++)
                if (this[key][i]['val'] < 5000) {
                    valStr += i + keyStr + ':' + this[key][i]['val'] + ' ';
                }
        }
        return [str + ' ' + this.normlXiangting(), valStr, debugStr];
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
        for (let times = 0; times < 136; times++) {
            if(times == 124) {
                logger.number = -1;
                break;
            }
            let now = Date.now();
            let tile = tileIDToCode(list[times]);

            let key = getKey(tile);
            let card = parseInt(getCard(tile));

            this.tileInfo.reduceRemain(key, card);
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