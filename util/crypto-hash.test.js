const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', ()=>{
    it ('generates a sha-256 hashed output',()=>{
        expect(cryptoHash('123'))
            .toEqual('a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
    });

    it('produces the same hash with the same input in any order', ()=>{
        expect(cryptoHash('one', 'two', 'three'))
        .toEqual(cryptoHash('three','one','two'));
    });
});