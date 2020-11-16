const { expect, assert } = require( "chai" );

const Token = artifacts.require('GasToken');
const { expectEvent } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = require( "@openzeppelin/test-helpers/src/constants" );

const toWei = _amount => web3.utils.toWei(_amount.toString(), 'ether');

contract('Token', async ([admin, user1]) => {
    let timestamps = [];
    let gasUsed = [];

    beforeEach(async () => {
        this.token = await Token.new("GasToken", "GTX", { from: admin });
        for(let i = 1; i <= 5; ++i) {
            const currentTime = Date.now();
            timestamps = [timestamps, currentTime.toString()];
            gasUsed = [...gasUsed, i.toString()];
        }
    });

    it('should set token details properly', async () => {
        const name = await this.token.name();
        const symbol = await this.token.symbol();
        const totalSupply = await this.token.totalSupply();

        expect(name).to.equal("GasToken");
        expect(symbol).to.equal("GTX");
        expect(totalSupply.toString()).to.equal(toWei(7000));
    })

    describe('Claim rewards', () => {
        it("should claim rewards properly", async () => {
            await this.token.claimRewards(timestamps, gasUsed);
        })
    })
})