const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { expect } = require('chai');
// Load compiled artifacts
const EthanolVault = artifacts.require('EthanolVault');
 
// Start test block
contract('EthanolVaultUpgrade (proxy)', ([deployer, wallet]) => {
  beforeEach(async () => {
    this.contract = await deployProxy(
      EthanolVault, 
      [wallet], { 
        initializer: 'initialize',
        unsafeAllowCustomTypes: true 
      }
    )
  }

  );

  it('should set upgrade proxy correctly', () => assert(this.contract.address !== ''));

  it('should  retrieve the address of the admin', async () => {
    expect(
      await this.contract.admin()
    ).to.equal(deployer)
  })

});