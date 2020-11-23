const { deployProxy } = require('@openzeppelin/truffle-upgrades');
 
// Load compiled artifacts
const Ethanol = artifacts.require('Ethanol');
const EthanolVault = artifacts.require('EthanolVault');
 
// Start test block
contract('EthanolVaultUpgrade (proxy)', ([deployer, wallet]) => {
  beforeEach(async () => {
    // deploy tokens
    this.token = await deployProxy(
      Ethanol, 
      [wallet], { 
        initializer: 'initialize',
        unsafeAllowCustomTypes: true 
      }
    )

    this.contract = await deployProxy(
      EthanolVault, 
      [this.token.address], { 
        initializer: 'initialize',
        unsafeAllowCustomTypes: true 
      }
    )

  }

  );

  it('should set upgrade proxy correctly', () => assert(this.contract.address !== ''));

  it('should  retrieve the address of the admin', async () => {
    console.log(this.contract.methods)
    const _admin = await this.contract.methods.wallet();
    assert.equal(_admin, deployer)
  })
});