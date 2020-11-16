const { expect, assert } = require( "chai" );

const Token = artifacts.require('GasToken');
const { expectEvent } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = require( "@openzeppelin/test-helpers/src/constants" );

const toWei = _amount => web3.utils.toWei(_amount.toString(), 'ether');

contract('Token', async ([admin, user1, user2]) => {
    let timestamps = [];
    let gasUsed = [];
    let totalGasUsed = 0;

    beforeEach(async () => {
        this.token = await Token.new("GasToken", "GTX", { from: admin });
        // transfer some token=s to user
        await this.token.transfer(user1, toWei(200), { from: admin});

        // populate the timestamps and gasused array with some dumb data
        for(let i = 1; i <= 5; ++i) {
            const currentTime = Date.now();
            timestamps = [...timestamps, currentTime.toString()];
            gasUsed = [...gasUsed, i.toString()]; 
            totalGasUsed = totalGasUsed + i;
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
        beforeEach(async () => {
            await this.token.claimRewards(timestamps, gasUsed, { from: user1 });
        })

        it("should claim rewards properly", async () => {
            const result = await this.token.claimableRewards(user1);
            expect(result.toString()).to.equal(totalGasUsed.toString());
        })

        it("should reject if the same data is sent twice", async () => {
            try {
                await this.token.claimRewards(timestamps, gasUsed, { from: user1 });
            } catch (error) {
                assert(error.message.includes("Invalid transactions"));
                return;
            }
            asssert(false);
        })

        it("should withraw token to user account", async () => {
            const initialBalance = await this.token.balanceOf(user1);

            const _rewards = await this.token.claimableRewards(user1);

            await this.token.withdrawRewards(_rewards.toString(), { from: user1 });
            const currentBalance = await this.token.balanceOf(user1);

            expect(currentBalance.toString()).to.equal((Number(initialBalance) + Number(20).toString()));
        })
    })
})