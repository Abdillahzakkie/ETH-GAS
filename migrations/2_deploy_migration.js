const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Vault = artifacts.require('Vault');

module.exports = async (deployer, network, [admin]) => {
  const instance = await deployProxy(Vault, ["GasToken", "GTX"], { 
    deployer,
    initializer: 'initialize',
    from: admin
  });
  // const upgraded = await upgradeProxy(instance.address, BoxV2, { deployer });
}