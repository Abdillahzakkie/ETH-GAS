const GasToken = artifacts.require("GasToken");

module.exports = function (deployer) {
  deployer.deploy(GasToken, "GasToken", "GTX");
};
