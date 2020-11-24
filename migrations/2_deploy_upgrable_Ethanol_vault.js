const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const EthanolVault = artifacts.require('EthanolVault');


module.exports = async (deployer, network, [admin]) => {
  const EthanolAddress = `0x63D0eEa1D7C0d1e89d7e665708d7e8997C0a9eD6`;

  const instance = await deployProxy(EthanolVault, [EthanolAddress], {
    deployer,
    initializer: 'initialize',
    unsafeAllowCustomTypes: true
  });

  console.log(`Instance addres: ${instance.address}`)
}