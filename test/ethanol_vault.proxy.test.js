const { deployProxy } = require('@openzeppelin/truffle-upgrades');
 
// Load compiled artifacts
const EthanolVaultUpgraded = artifacts.require('EthanolVaultUpgraded');
 
// Start test block
contract('EthanolVaultUpgrade (proxy)', ([admin]) => {
  beforeEach(async () => {

    this.contract = await deployProxy(
      EthanolVaultUpgraded, 
      [admin], 
      { 
        initializer: 'initialize',
        unsafeAllowCustomTypes: true 
      }
    )
  }

  );

  it('should set upgrade proxy correctly', () => assert(this.contract.address !== ''));

  it('should  retrieve the address of the admin', async () => {
    console.log(this.contract)
    const _admin = await this.contract.admin();
    assert.equal(_admin, admin)
  })
});