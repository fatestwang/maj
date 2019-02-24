class TimeRecorder{
    constructor(){
        this.recordTime = [];
        this.recordList = [];
    }
    record(){
        this.recordTime.push(Date.now());  
    }
    print(){
        let recordStr = "";
        for(let i = 1; i < this.recordTime.length; i++)
            recordStr += (this.recordTime[i] - this.recordTime[i - 1]) + ' ';
        console.log(recordStr);
        this.recordList.push(recordStr);
        this.recordTime = [];
    }
}

let timeRecorder = new TimeRecorder();

class MAJAI{
    constructor(){
        this.newRoundInited = false;
    }

    initEnviroment(seat, ju, ben, liqibang, scores, dora, tiles){
        this.enviroment = {
            seat:seat,
            playerList:{
                0:{//self
                    score:scores[0],
                    handList: 0 == seat ? tiles : [],
                    discardList:[],
                    showList:[],
                    isLiZhi: false,
                    isZhenTing: false,
                },
                1:{
                    score:scores[1],
                    handList: 1 == seat ? tiles : [],
                    discardList:[],
                    showList:[],
                    isLiZhi: false,
                    isZhenTing: false,
                },
                2:{
                    score:scores[2],
                    handList: 2 == seat ? tiles : [],
                    discardList:[],
                    showList:[],
                    isLiZhi: false,
                    isZhenTing: false,
                },
                3:{
                    score:scores[3],
                    handList: 3 == seat ? tiles : [],
                    discardList:[],
                    showList:[],
                    isLiZhi: false,
                    isZhenTing: false,
                }
            },
            ju:ju, 
            ben:ben, 
            liqibang:liqibang,
            doraList:[dora],
        };
    }

    //api交互区
    discardTile(seat, tile, is_liqi, is_wliqi, moqie, doras){
        this.players[seat].discardTile(tile, is_liqi, is_wliqi, moqie);
        this.enviroment.setDoras(doras);
    }
    dealTile(seat, tile, doras){
        this.players[seat].dealTile(tile);
        this.enviroment.setDoras(doras);
    }
    chiPengGang(seat, tiles, type){
        this.players[seat].chiPengGang(type, tiles);
    }
    anGangAddGang(seat, tiles, type){
        this.players[seat].anGangAddGang(type, tiles);
    }

    newRound(ju, ben, liqibang, scores, dora, tiles){
        this.initEnviroment(ju, ben, liqibang, scores, dora, tiles);
        this.newRoundInited = true;
        console.log(this.enviroment);
    }
    roundEnded(){
        this.newRoundInited = false;
    }
    //工作区
    guessCard(){
        return new Promise((resolve, reject)=>{
            resolve(1);
        });
    }
    
    analysisHandCard(){
        return new Promise((resolve, reject)=>{
            resolve(2);
        });
    }
    judgement(){
        return new Promise((resolve, reject)=>{
            resolve(3);
        });
    }

    /**
     * 分工步骤，尽量不卡住界面的刷新
     */
    work(caller, doActionCallback){
        //if(!this.newRoundInited) return;
        timeRecorder.record();
        this.guessCard()
            .then(()=>{
                timeRecorder.record();
                return this.analysisHandCard();
            })
            .then(()=>{
                timeRecorder.record();
                return this.judgement();
            })
            .then(()=>{
                timeRecorder.record();
                timeRecorder.print();
                //doActionCallback.call(caller, this.operantion);
                return 'end';
            })
            .catch((err)=>{console.log('work err:', err);});
    }
}

let majAI = new MAJAI();
majAI.work(null, null);