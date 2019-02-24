//FData已经完成了它的使命，不再需要啦。
class FData{
    constructor(){
        console.log('this is a hackde info');
    }
    onMessage(e){
        this.lastGetData = e.data;
        console.log('get', e.data);
    }
    onSendMessage(e){
        this.lastSendData = new Uint8Array(e);
        console.log('send ', this.lastSendData);
        let cmdLength = this.lastSendData[4];
        console.log(cmdLength);
        let str = '';
        for(let i = 5; i < 5 + cmdLength; i++)
            str += String.fromCharCode(this.lastSendData[i]);
        console.log('cmd: ',str,' data:', this.lastSendData.slice(5 + cmdLength));
    }
}
let fData = new FData();

//test
e = new ArrayBuffer(16);
fData.onSendMessage(e);