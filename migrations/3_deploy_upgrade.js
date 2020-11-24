const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const EthanolVault = artifacts.require('EthanolVault');
const EthanolVaultUpgraded  = artifacts.require('EthanolVaultUpgraded');

module.exports = async (deployer, network, [admin]) => {
    const existing = await EthanolVault.deployed();
    const upgrade = await upgradeProxy(existing.address, EthanolVaultUpgraded, {
        deployer,
        initializer: 'initialize',
        unsafeAllowCustomTypes: true
    });
    console.log(`upgradeProxy: ${upgrade.address}`)
}