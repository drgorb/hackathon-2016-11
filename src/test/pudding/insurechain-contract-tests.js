var fs = require ("fs");
var crypto = require('crypto');
var Web3 = require ("web3");
var _ = require ("lodash");
var $q = require ("q");

var web3 = new Web3 ();
web3.setProvider (new web3.providers.HttpProvider ('http://localhost:8545'));

console.log(web3.eth.getCompilers());

var soliditySources = {
    retailers: (fs.readFileSync ('contracts/Retailers.sol') + ' '),
    insurances: (fs.readFileSync ('contracts/Insurances.sol') + ' ')
}

var contractTransactions = [];

var compiledContracts = {};

_.each (soliditySources, (source, name) => {
    compiledContracts[name] = web3.eth.compile.solidity (source);
    compiledContracts[name].contract = web3.eth.contract(compiledContracts[name].info.abiDefinition);
    var defer = $q.defer();
    compiledContracts[name].contract.new({
            from: web3.eth.accounts[0],
            data: compiledContracts[name].code,
            value: 0,
            gas: 1000000
        },
        function(err, contract) {
            if (err) {
                defer.reject(err);
            } else {
                /*the callback is called twice, the second time with an address*/
                if(contract.address){
                    contract.name = name;
                    defer.resolve(contract);
                }
            }
        });
    contractTransactions.push(defer.promise)
});

$q.all(contractTransactions)
    .then(function (results) {
        var json = "";
        var exports = "export {x";
        results.forEach(function (result) {
            if (result.name) {
                /*TODO: if the hash is the same as the existing contract, do not overwrite*/
                var abiString = JSON.stringify(result.abi);
                var abiHash = crypto.createHash('sha256').update(abiString, 'utf8').digest('hex');
                json += "\nvar " + result.name + " = {address: '" + result.address + "', \n" +
                    "abi: " + abiString +", \n" +
                    "abiHash: '"+ abiHash +"'};";
                exports += ", " + result.name;
            } else {
                console.log(result.reason);
            }
        });
        exports = exports.replace("x, ", "");
        console.log(json + "\n" + exports + "}");
        return json + "\n" + exports + "}";
    }).then(function(javascript) {
        fs.writeFile("src/modules/ethereum/contract-definitions.js", javascript, (err) => {
            if (err) throw err;
            console.log('It\'s saved!');
        });
    });
