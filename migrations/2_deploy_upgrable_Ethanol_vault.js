const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Ethanol = artifacts.require('Ethanol');
const EthanolVault = artifacts.require('EthanolVault');


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
}