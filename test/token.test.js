const { expect, assert } = require( "chai" );

const Token = artifacts.require('GasToken');
const { expectEvent } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = require( "@openzeppelin/test-helpers/src/constants" );

const toWei = _amount => web3.utils.toWei(_amount.toString(), 'ether');

contract('Token', async ([admin, user1]) => {
    beforeEach(async () => this.token = await Token.new("GasToken", "GTX", { from: admin }));

    it('should set token details properly', async () => {
        const name = await this.token.name();
        const symbol = await this.token.symbol();
        const totalSupply = await this.token.totalSupply();

        expect(name).to.equal("GasToken");
        expect(symbol).to.equal("GTX");
        expect(totalSupply.toString()).to.equal(toWei(7000));
    })


    describe('Transfer', () => {
        it('should transfer token to another wallet', async () => {
            await this.token.transfer(user1, toWei(10), { from: admin });
            const balanceAdmin = await this.token.balanceOf(admin);
            const balanceUser1 = await this.token.balanceOf(user1);
            expect(balanceAdmin.toString()).to.equal(toWei(990)); 
            expect(balanceUser1.toString()).to.equal(toWei(10)); 
        });

        it('should emit transfer event', async () => {
            const reciept = await this.token.transfer(user1, toWei(10), { from: admin });
            expectEvent(reciept, 'Transfer', { from: admin, to: user1, value: toWei(10) })
        })

        it("should not transfer if balance of the sender is less than amount", async () => {
            try {
                await this.token.transfer(user1, toWei(100), { from: user1 });
            } catch (error) {
                assert(error.message.includes("Not enough balance"));
                return;
            }
            assert(false);
        })

        it('should rejects invalid recipient', async () => {
            try {
                await this.token.transfer(ZERO_ADDRESS, toWei(100), { from: admin });
            } catch (error) {
                assert(error.message.includes("Recipient address is zero address"));
                return;
            }
            assert(false);
        })
    })
    
    describe("Approve", () => {
        it("should approve an allowance to thr recipient", async () => {
            await this.token.approve(user1, toWei(100));
            const allowanceUser1 = await this.token.allowances(admin, user1);
            expect(allowanceUser1.toString()).to.equal(toWei(100));
        })

        it("should emit approval event", async () => {
            const reciept = await this.token.approve(user1, toWei(10), { from: admin });
            expectEvent(reciept, 'Approval', { owner: admin, spender: user1, value: toWei(10) });
        })

        it('should reject invalid recipient', async () => {
            try {
                await this.token.approve(ZERO_ADDRESS, toWei(10), { from: admin })
            } catch (error) {
                assert(error.message.includes("Recipient address is zero address"));
            }
        })
    })

    describe('TransferFrom', () => {
        it("should transfer tokens to spender's wallet", async () => {
            await this.token.approve(user1, toWei(10), { from: admin });
            await this.token.transferFrom(admin, user1, toWei(10), { from: user1 });
            const balance = await this.token.balanceOf(user1);
            expect(balance.toString()).to.equal(toWei(10));
        })

        it("should not transfer tokens if allowance is zero", async () => {
            try {
                await this.token.approve(user1, toWei(0), { from: admin });
                await this.token.transferFrom(admin, user1, toWei(0), { from: user1 });
            } catch (error) {
                assert(error.message.includes("Zero allowance allocated"));
                return;
            }
            assert(false);
        })

        it("should not transfer tokens if amount exceeds allowance", async () => {
            try {
                await this.token.approve(user1, toWei(10), { from: admin });
                await this.token.transferFrom(admin, user1, toWei(50), { from: user1 });
            } catch (error) {
                assert(error.message.includes("Amount exceeds approved balance"));
                return;
            }
            assert(false);
        })

        it("should emit transfer event", async () => {
            await this.token.approve(user1, toWei(10), { from: admin });
            const reciept = await this.token.transferFrom(admin, user1, toWei(10), { from: user1 });
            expectEvent(reciept, 'Transfer', { from: admin, to: user1, value: toWei(10) });
        })
    })

})