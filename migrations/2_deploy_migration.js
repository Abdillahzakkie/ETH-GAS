const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Token = artifacts.require('Ethanol');
const EthanolVault = artifacts.require('EthanolVault');
const EthanolVaultUpgraded  = artifacts.require('EthanolVaultUpgraded');

module.exports = async (deployer, network, [admin]) => {
  // const EthanolAddress = `0x3985EeaeE096b1b34F179Fb1b919caB70ee40812`;

  // deploy token contract
  const token = await deployProxy(EthanolVault, [admin], { 
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