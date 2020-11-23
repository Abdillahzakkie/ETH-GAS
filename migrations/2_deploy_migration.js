const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Ethanol = artifacts.require('Ethanol');
const EthanolVault = artifacts.require('EthanolVault');
const EthanolVaultUpgraded  = artifacts.require('EthanolVaultUpgraded');


module.exports = async (deployer, network, [admin]) => {
  // deploy token contract
  const token = await deployProxy(Ethanol, [admin], {
    deployer,
    initializer: 'initialize',
    unsafeAllowCustomTypes: true
  });

  const instance = await deployProxy(EthanolVault, [token.address], {
    deployer,
    initializer: 'initialize',
    unsafeAllowCustomTypes: true
  });
  console.log(`Instance addres: ${instance.address}`)
  
  const upgraded = await upgradeProxy(instance.address, EthanolVaultUpgraded, {
    deployer,
    initializer: 'initialize',
    unsafeAllowCustomTypes: true
  });

  console.log(`Upgraded addres: ${upgraded.address}`)

}