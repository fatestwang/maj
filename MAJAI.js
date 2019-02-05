class MAJAI{
    constructor(type = 'balance', attackWeight = 1, defendWeight = 1){
         
    }

    init(enviroment, handCards){
        this.currentPlayer = 0; 
        this.activeCard = -1;
    }

    /**
     * 每次操作记录
     * @param {*} player 玩家 
     * @param {*} operation 操作：吃碰杠摸胡打
     * @param {*} mainCard 主要操作牌
     * @param {*} cardIDList 吃碰杠牌合集，特别的加杠不应该有
     */
    change(player, operation, mainCard, cardIDList){

    }

    /**
     * 响应操作 
     */
    work(){
        if(this.currentPlayer == 0){//打，暗杠，立直，自摸
            let exceptScoreList = oHandCard.canWin();
            if(exceptScoreList && oEnviroment.judge(exceptScoreList))
                convertHelper.sendZimo();
            if(oHandCard.canWin() && oEnviroment.judge(oHandCard.ExceptScoreList())) {
                convertHelper.sendZimo();
                return ;
            }
            if(oHandCard.canRichi() && oEnviroment.judge(oHandCard.ExceptScoreList())){
                convertHelper.sendRichi(oHandCard.RichiCard());
                return ;
            }
            if(oHandCard.canGang() && oEnviroment.judge(oHandCard.ExceptScoreList())){

            }

        }
        else if(this.currentPlayer == 3){//吃，碰，杠，荣

        }
        else {//碰，杠，荣

        }
        return cardID;
    }
}

export default MAJAI;