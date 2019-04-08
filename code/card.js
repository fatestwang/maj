let judge = function (three, two, one, outThree, doralist, changfeng, zifeng, bangzi, ben, unKnowCardList) {
    console.log(three, two, one);
}

//unSpiteObj = {0,1,2,3,4,...33}
let splitDFS = function (unSpiteObj, three = [], two = [], one = []) {
    debugger;
    if (one.length > 5) return;
    let key;
    for (key = 0; unSpiteObj[key] == 0 && key < 34; key++);
    //----------------------------------------------------
    if (key >= 34) {
        judge(three, two, one);
        return;
    }
    //----------------------------------------------------
    //单卡
    if (unSpiteObj[key] == 1) {
        if (key >= 27 ||
            key % 9 == 8 ||
            key % 9 == 7 && unSpiteObj[key + 1] != 1 ||
            !(unSpiteObj[key + 1] + unSpiteObj[key + 2] == 1 && (key % 9 == 6 || key % 9 == 5 && unSpiteObj[key + 3] == 0 || key % 9 < 5 && unSpiteObj[key + 3] + unSpiteObj[key + 4] == 0))) {
            unSpiteObj[key]--;
            one.push(key);
            if (one.length > 1 && (key % 9 > 0 && one[one.length - 2] == key - 1 || key % 9 > 1 && one[one.length - 2] == key - 2)) {
                one.pop();
                unSpiteObj[key]++;
            } else {
                splitDFS(unSpiteObj, three, two, one);
                one.pop();
                unSpiteObj[key]++;
            }
        }
    }
    //----------------------------------------------------
    //雀头
    if (unSpiteObj[key] == 2) {
        unSpiteObj[key] -= 2;
        two.push([key, key]);
        splitDFS(unSpiteObj, three, two, one);
        two.pop();
        unSpiteObj[key] += 2;
    }
    //连张
    if (key < 27) {
        if (key % 9 < 8 && unSpiteObj[key + 1] > 0) {
            unSpiteObj[key] -= 1;
            unSpiteObj[key + 1] -= 1;
            two.push([key, key + 1]);
            splitDFS(unSpiteObj, three, two, one);
            two.pop();
            unSpiteObj[key] += 1;
            unSpiteObj[key + 1] += 1;
        }
        if (key % 9 < 7 && unSpiteObj[key + 2] > 0 && unSpiteObj[key + 1] == 0) {
            unSpiteObj[key] -= 1;
            unSpiteObj[key + 2] -= 1;
            two.push([key, key + 2]);
            splitDFS(unSpiteObj, three, two, one);
            two.pop();
            unSpiteObj[key] += 1;
            unSpiteObj[key + 2] += 1;
        }
    }
    //----------------------------------------------------
    //刻子
    if (unSpiteObj[key] > 2) {
        unSpiteObj[key] -= 3;
        three.push([key, key, key]);
        splitDFS(unSpiteObj, three, two, one);
        three.pop();
        unSpiteObj[key] += 3;
    }
    //顺子
    if (key < 27) {
        if (key % 9 < 7 && unSpiteObj[key + 1] > 0 && unSpiteObj[key + 2] > 0) {
            unSpiteObj[key] -= 1;
            unSpiteObj[key + 1] -= 1;
            unSpiteObj[key + 2] -= 1;
            three.push([key, key + 1, key + 2]);
            splitDFS(unSpiteObj, three, two, one);
            three.pop();
            unSpiteObj[key] += 1;
            unSpiteObj[key + 1] += 1;
            unSpiteObj[key + 2] += 1;
        }
    }
    return;
}
let test = {}
for (let i = 0; i < 34; i++) {
    test[i] = 0;
}
test[8] = 3;
test[7] = 1;

splitDFS(test);