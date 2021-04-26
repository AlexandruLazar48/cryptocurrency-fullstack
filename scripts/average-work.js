const Block = require('./block');
const Blockchain = require('../blockchain');

const blockchain = new Blockchain;

blockchain.addBlock({data:'initial'});
console.log('first block', blockchain.chain[blockchain.chain.length-1]);
let prevTime, nextTime, nextBlock, timeDif, avg;

const times = []

for (i = 0; i<10000; i++){
    prevTime = blockchain.chain[blockchain.chain.length-1].timestamp;
    blockchain.addBlock({data:`block ${i}`});
    nextBlock = blockchain.chain[blockchain.chain.length-1];
    nextTime = nextBlock.timestamp;
    timeDif = nextTime - prevTime;
    times.push(timeDif);
    avg = times.reduce((total, num)=> (total+num))/times.length;
    console.log(`Time to mine block: ${timeDif}ms.\t Nonce: ${nextBlock.nonce}.\t Next Difficulty: ${nextBlock.difficulty}.\t Average time: ${avg}`);
}