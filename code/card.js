let result = {};
for (let i = 0; i < 34; i++) {
    result[i] = {
        value: 0, //当前分法最优值
        xiangting: 6, //当前分法向听数
        isA: false, //
        isB: false, //
        isC: false, //
    }
}
let recordBest = function (three, two, one) {
    let hasQueTou = 0;
    for (let i = 0; i < two.length; i++) {
        if (two[i][0] == two[i][1])
            hasQueTou++;
    }
    let haskezi = 0;
    for (let i = 0; i < three.length; i++) {
        if (three[i][0] == three[i][1])
            haskezi++;
    }

    //计算向听
    let curXiangting = 0;
    let twos = two.length;
    let ones = one.length;
    while (twos > 0 && ones > 0) {
        curXiangting++;
        twos--;
        ones--;
    }
    if (twos == 0)
        curXiangting += (ones - 1) / 3 * 2;
    else {
        curXiangting += (twos - 2) / 3 * 2;
        if (!hasQueTou)
            curXiangting++;
    }
    //判断一类进张
    for (let i = 0; i < two.length; i++)
        if (two[i][0] == two[i][1]) {
            if (hasQueTou > 1) {
                updateResult(two[i][0], curXiangting, true);
                if (two[i][0] < 27) {
                    if (two[i][0] % 9 < 8) updateResult(two[i][0] + 1, curXiangting, false, true);
                    if (two[i][0] % 9 > 0) updateResult(two[i][0] - 1, curXiangting, false, true);
                }

            } else {
                updateResult(two[i][0], curXiangting, false, true)
                if (two[i][0] < 27) {
                    if (two[i][0] % 9 < 8) updateResult(two[i][0] + 1, curXiangting + 1, false, true);
                    if (two[i][0] % 9 > 0) updateResult(two[i][0] - 1, curXiangting + 1, false, true);
                }
            }
        }
    else {
        if (two[i][0] == two[i][1] - 1) {
            if (two[i][0] % 9 > 0) updateResult(two[i][0] - 1, curXiangting, true)
            if (two[i][1] % 9 < 8) updateResult(two[i][1] + 1, curXiangting, true)
            if (two[i][0] % 9 > 1) updateResult(two[i][0] - 2, curXiangting, false, true);
            if (two[i][1] % 9 < 7) updateResult(two[i][1] + 2, curXiangting, false, true);
        } else {
            updateResult(two[i][0] + 1, curXiangting, true)
            if (two[i][0] % 9 > 0) updateResult(two[i][0] - 1, curXiangting, false, true);
            if (two[i][1] % 9 < 8) updateResult(two[i][1] + 1, curXiangting, false, true);
            if (two[i][0] % 9 > 1) updateResult(two[i][0] - 2, curXiangting, false, true);
            if (two[i][1] % 9 < 7) updateResult(two[i][1] + 2, curXiangting, false, true);

        }
    }
    for (let i = 0; i < one.length; i++) {
        if (hasQueTou == 0 || hasQueTou == 1 && two.length == 1)
            updateResult(one[i], curXiangting, true);
        else
            updateResult(one[i], curXiangting, false, true);
        if (one[i] < 27) {
            if (twos == 0 && (ones > 1 || haskezi)) {
                if (one[i] % 9 > 0) updateResult(one[i] - 1, curXiangting, false, true);
                if (one[i] % 9 > 1) updateResult(one[i] - 2, curXiangting, false, true);
                if (one[i] % 9 < 8) updateResult(one[i] + 1, curXiangting, false, true);
                if (one[i] % 9 < 7) updateResult(one[i] + 2, curXiangting, false, true);
            } else if (ones == 0) {
                if (one[i] % 9 > 0) updateResult(one[i] - 1, curXiangting, false, true);
                if (one[i] % 9 > 1) updateResult(one[i] - 2, curXiangting, false, true);
                if (one[i] % 9 < 8) updateResult(one[i] + 1, curXiangting, false, true);
                if (one[i] % 9 < 7) updateResult(one[i] + 2, curXiangting, false, true);
            }
        }
    }
}

//暂时以向听数为标准
let updateResult = function (key, xiangting, isA = false, isB = false, isC = false) {
    if (xiangting > result[key].xiangting)
        return;
    if (xiangting < result[key].xiangting) {
        result[key] = {
            value: 0, //当前分法最优值
            xiangting: xiangting, //当前分法向听数
            isA: isA,
            isB: isB,
            isC: isC,
        }
        return;
    }
    if (isA) result[key].isA = isA;
    if (isB) result[key].isB = isB;
    if (isC) result[key].isC = isC;
}

//unSpiteObj = {0,1,2,3,4,...33}
let splitDFS = function (unSpiteObj, three = [], two = [], one = []) {
    if (one.length > 5) return;
    let key;
    let pre = false;
    for (key = 0; unSpiteObj[key] == 0 && key < 34; key++);
    //----------------------------------------------------
    if (key >= 34) {
        recordBest(three, two, one);
        return;
    }
    //----------------------------------------------------
    //单卡
    if (unSpiteObj[key] % 3 == 1) {
        if (key >= 27 ||
            key % 9 == 8 ||
            key % 9 == 7 && unSpiteObj[key + 1] != 1 ||
            !(unSpiteObj[key + 1] + unSpiteObj[key + 2] == 1 && (key % 9 == 6 || key % 9 == 5 && unSpiteObj[key + 3] == 0 || key % 9 < 5 && unSpiteObj[key + 3] + unSpiteObj[key + 4] == 0))) {
            pre = false;
            if (key % 9 > 1)
                for (var i = 0; i < two.length; i++) {
                    if (two[i][0] == key - 2 && two[i][1] == key - 1)
                        pre = true;
                }
            if (!pre) {
                unSpiteObj[key]--;
                one.push(key);
                if (one.length > 1 && (key % 9 > 0 && one[one.length - 2] == key - 1 || key % 9 > 1 && one[one.length - 2] == key - 2)) {
                    one.pop();
                    unSpiteObj[key]++;
                } else if (one.length > 1 && (one[one.length - 2] == key)) {
                    one.pop();
                    unSpiteObj[key]++;
                } else {
                    splitDFS(unSpiteObj, three, two, one);
                    one.pop();
                    unSpiteObj[key]++;
                }
            }
        }
    }
    //----------------------------------------------------
    //雀头
    if (unSpiteObj[key] == 2) {
        unSpiteObj[key] -= 2;
        two.push([key, key]);
        if (one.length > 0 && (one[one.length - 1] == key)) {
            two.pop();
            unSpiteObj[key] += 2;
        } else {
            splitDFS(unSpiteObj, three, two, one);
            two.pop();
            unSpiteObj[key] += 2;
        }
    }
    //连张
    if (key < 27) {
        pre = false;
        if (key % 9 > 1)
            for (var i = 0; i < two.length; i++) {
                if (two[i][0] == key - 2 && two[i][1] == key - 1)
                    pre = true;
            }
        if (!pre) {
            if (key % 9 < 8 && unSpiteObj[key + 1] > 0) {
                pre = false;
                if (key % 9 > 0)
                    for (var i = 0; i < one.length; i++) {
                        if (one[i] == key - 1)
                            pre = true;
                    }
                if (!pre) {
                    unSpiteObj[key] -= 1;
                    unSpiteObj[key + 1] -= 1;
                    two.push([key, key + 1]);
                    splitDFS(unSpiteObj, three, two, one);
                    two.pop();
                    unSpiteObj[key] += 1;
                    unSpiteObj[key + 1] += 1;
                }
            }
            if (key % 9 < 7 && unSpiteObj[key + 2] > 0 && unSpiteObj[key + 1] == 0) {
                pre = false;
                for (var i = 0; i < two.length; i++) {
                    if (two[i][0] == key && two[i][1] == key + 1)
                        pre = true;
                }
                if (!pre) {
                    unSpiteObj[key] -= 1;
                    unSpiteObj[key + 2] -= 1;
                    two.push([key, key + 2]);
                    splitDFS(unSpiteObj, three, two, one);
                    two.pop();
                    unSpiteObj[key] += 1;
                    unSpiteObj[key + 2] += 1;
                }
            }
        }
    }
    //----------------------------------------------------
    //刻子
    if (unSpiteObj[key] == 3) {
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
test[0] = 3;
test[1] = 1;
test[2] = 1;
test[3] = 1;
test[4] = 1;
test[5 + 18] = 1;
test[6 + 18] = 1;
test[7] = 1;
test[9] = 3;

splitDFS(test);