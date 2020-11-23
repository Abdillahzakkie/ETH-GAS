const { deployProxy } = require('@openzeppelin/truffle-upgrades');
 
// Load compiled artifacts
const Ethanol = artifacts.require('Ethanol');
 
// Start test block
contract('EthanolVaultUpgrade (proxy)', ([admin]) => {
  beforeEach(async () => {

    this.contract = await deployProxy(
      Ethanol, 
      [admin], { 
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