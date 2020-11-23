const { expect, assert } = require( "chai" );
const { expectEvent } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");

const EthanolVault = artifacts.require('EthanolVault');
const Token = artifacts.require('Ethanol');

const toWei = _amount => web3.utils.toWei(_amount.toString(), 'ether');

contract('EthanolVault', async ([admin, wallet, user1, user2]) => {
    let timestamps = [];
    let gasUsed = [];
    let totalGasUsed = 0;

    beforeEach(async () => {
        this.token = await Token.new(wallet, { from: admin });
        this.contract = await EthanolVault.new(this.token.address, { from: admin });

        // transfer some tokens to other wallet
        await this.token.transfer(user1, toWei(200), { from: admin});
        await this.token.transfer(user2, toWei(200), { from: admin});
        await this.token.transfer(wallet, toWei(7000), { from: admin });

        // approve tokens from wallet to EthanolVault contract
        await this.token.approve(this.contract.address, toWei(6500), { from: admin });

        // populate the timestamps and gasused array with some dumb data
        for(let i = 1; i <= 5; ++i) {
            const currentTime = Date.now();
            timestamps = [...timestamps, currentTime.toString()];
            gasUsed = [...gasUsed, i.toString()]; 
            totalGasUsed = totalGasUsed + i;
        }
    });

    it("should transfer tokens to user1 & user2", async () => {
        // expect balance of user1 to equal 192tokens
        expect(
            (await this.token.balanceOf(user1)).toString()
        ).to.equal(toWei(192));

        // expect balance of user2 to equal 192tokens
        expect(
            (await this.token.balanceOf(user2)).toString()
        ).to.equal(toWei(192));
    })

    // describe('Claim rewards', () => {
    //     beforeEach(async () => {
    //         await this.token.claimRewards(timestamps, gasUsed, { from: user1 });
    //     })

    //     it("should claim rewards properly", async () => {
    //         const result = await this.token.claimableRewards(user1);
    //         expect(result.toString()).to.equal(totalGasUsed.toString());
    //     })

    //     it("should reject if the same data is sent twice", async () => {
    //         try {
    //             await this.token.claimRewards(timestamps, gasUsed, { from: user1 });
    //         } catch (error) {
    //             assert(error.message.includes("Invalid transactions"));
    //             return;
    //         }
    //         asssert(false);
    //     })

    //     // it("should withraw token to user account", async () => {
    //     //     const initialBalance = await this.token.balanceOf(user1);

    //     //     const _rewards = await this.token.claimableRewards(user1);

    //     //     await this.token.withdrawRewards(_rewards.toString(), { from: user1 });
    //     //     const currentBalance = await this.token.balanceOf(user1);

    //     //     expect(currentBalance.toString()).to.equal((Number(initialBalance) + Number(20).toString()));
    //     // })
    // })

    // describe("Store tokens in vault(TimeLock)", () => {
    //     let reciept;
    //     const time =  Math.floor(Date.now());

    //     beforeEach(async () => {
    //         reciept = await this.token.TimeLock(web3.utils.toBN(time), toWei(10), { from: user1 });
    //     })

    //     it("should lock user token in vault", async () => {
    //         let result = await this.token.balanceOf(this.token.address);
    //         expect(result.toString()).to.equal(toWei(9.7));

    //         result = await this.token.getLocked(user1);
    //         expect(result.toString()).to.equal(toWei(9.7));
    //     })

    //     it("should emit time lock event", async () => {
    //         expectEvent(reciept, '_TimeLock', { stakeholder: user1, stake: toWei(9.7) })
    //     })
        
    // })

    // describe("Withdraw tokens", () => {
    //     beforeEach(async () => {
    //         await this.token.withdrawSavings(toWei(5), { from: user1 });
    //     })
    // })
})