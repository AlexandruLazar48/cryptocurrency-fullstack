const PubNub = require('pubnub');

const credentials ={
    publishKey: 'pub-c-feadb482-e934-4a0a-a6d3-09551833f8e9',
    subscribeKey: 'sub-c-fdcdbb8c-9e01-11eb-8d7b-b642bba3de20',
    secretKey: 'sec-c-ZjMxYWE0YTAtZjI0Yy00ZGI5LTlkYzUtYzc5MDNmY2ZjZTcx'
};

const CHANNELS = {
    TEST: 'TEST',
    TESTTWO: 'TEST2'
};

class PubSub{
    constructor(){
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({channels: Object.values(CHANNELS)});

        this.pubnub.addListener(this.listener);
    }
    listener(){
        return {
            message: messageObject => {
                const {channel, message} = messageObject

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            }
        }
    }
    publish({channel, message}){
        this.pubnub.publish({channel, message})
    }
}
const testPubSub = new PubSub();
testPubSub.publish({channel:CHANNELS.TEST, message:'hello pubnub'});

module.exports = PubSubPubNub;
