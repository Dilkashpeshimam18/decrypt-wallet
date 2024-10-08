const Migrations = artifacts.require("Migrations");
const DAICOIN = artifacts.require("DAICOIN");


module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(DAICOIN);

  const token=await DAICOIN.deployed()

};
