const Blockchain = require('./index');
const Block = require('./block');
const {cryptoHash} = require('../util');

describe('Blockchain',()=>{
    // const blockchain = new Blockchain();
    let blockchain, newChain, originalChain;

    beforeEach(()=>{
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    });

    it('contains a "chain" Array instance', () =>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'newData';
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain()', ()=>{
        describe('when a chain does not start with the genesis block',()=>{
            it('returns false', () =>{
                blockchain.chain[0] = { data:'bad-data'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
        
        describe('when the chain starts with the genesis block and has multiple blocks', ()=>{
            beforeEach(()=>{
                blockchain.addBlock({data:'1st item'});
                blockchain.addBlock({data:'2nd item'});
                blockchain.addBlock({data:'3rd item'});
            });
            describe('and the lastBlock reference has changed',()=>{
                it('returns false', ()=>{
                    blockchain.chain[2].lastHash = 'worng-hash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('and the chain contains a block with an invalid field',()=>{
                it('returns false',() =>{
                    blockchain.chain[2].data = 'bad-data';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('and the chain contains a block with a jumped difficulty', ()=>{
                it('returns false', ()=>{
                    const lastBlock = blockchain.chain[blockchain.chain.length-1];

                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;
                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data );
                    const newBlock = new Block({timestamp, lastHash, hash, data, nonce, difficulty});
                    blockchain.chain.push(newBlock);
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain does not contain any invalid blocks', ()=>{
                it('returns true',()=>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
    describe('replaceChain()', ()=>{
        beforeEach(()=>{
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });
        describe('when the new chain in not longer than the initial chain', ()=>{
            beforeEach(()=>{
                newChain.chain[0] = {new:'chain'};
                blockchain.replaceChain(newChain.chain);
            })
            it('does not replace the chain', ()=>{
                expect(blockchain.chain).toEqual(originalChain);
            });
            it('logs and error', ()=>{
                expect(errorMock).toHaveBeenCalled();
            })
        });
        describe('when the chain is longer',()=>{
            beforeEach(()=>{
                newChain.addBlock({data:'1st item'});
                newChain.addBlock({data:'2nd item'});
                newChain.addBlock({data:'3rd item'});
            })
            describe('and the chain is invalid',()=>{
                beforeEach(()=>{
                    newChain.chain[2].hash = 'bad-hash';
                    blockchain.replaceChain(newChain.chain);
                });
                it('does not replace the chain', ()=>{
                    expect(blockchain.chain).toEqual(originalChain);
                });
                it('logs and error', ()=>{
                    expect(errorMock).toHaveBeenCalled();
                });
            });
            describe('and the chain is valid',()=>{
                beforeEach(()=>{
                    blockchain.replaceChain(newChain.chain);
                })
                it('replaces the chain', ()=>{
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
                it('logs and error', ()=>{
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});
