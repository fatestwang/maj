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
                    this.newSingle(tile[1], tile[0]);
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

    //public
    reduceRemain(tile) {
        let key = tile[1];
        let card = parseInt(tile[0]);
        this[key][card]['remain']--;
    }
    clearRemain(tile){
        let key = tile[1];
        let card = parseInt(tile[0]);
        this[key][card]['remain'] = 0;
    }
}

exports.TileInfo = TileInfo;