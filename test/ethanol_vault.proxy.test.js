const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { expect } = require('chai')
// Load compiled artifacts
const Ethanol = artifacts.require('Ethanol');
const EthanolVault = artifacts.require('EthanolVault');
const EthanolVaultUpgraded = artifacts.require('EthanolVaultUpgraded');

 
// Start test block
contract('EthanolVaultUpgrade (proxy)', ([deployer, wallet]) => {
  beforeEach(async () => {
    this.contract = await deployProxy(
      EthanolVaultUpgraded, 
      [], { 
        initializer: 'initialize',
        unsafeAllowCustomTypes: true 
      }
    )

    this.contract = await deployProxy(
      EthanolVaultUpgraded, 
      [], { 
        initializer: 'initialize',
        unsafeAllowCustomTypes: true 
      }
    )
  }

  );

  it('should set upgrade proxy correctly', () => assert(this.contract.address !== ''));

  it('should  retrieve the address of the admin', async () => {
    const _admin = await this.contract.wallet();
    assert.equal(_admin, deployer)
  })

  it("author name", async () => {
    console.log(await this.contract.author())
    expect(
      await this.contract.author()
    ).to.equal("Abdullah")
  })
});