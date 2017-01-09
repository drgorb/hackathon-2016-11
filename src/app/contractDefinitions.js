const insureChain = {abi:[{"constant":true,"inputs":[{"name":"productId","type":"string"},{"name":"insurance","type":"address"},{"name":"startDate","type":"uint256"},{"name":"endDate","type":"uint256"},{"name":"productPrice","type":"uint256"}],"name":"getWarrantyQuote","outputs":[{"name":"warrantyPrice","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"productId","type":"string"},{"name":"serialNumber","type":"string"},{"name":"insurance","type":"address"}],"name":"getWarranty","outputs":[{"name":"startDate","type":"uint256"},{"name":"endDate","type":"uint256"},{"name":"status","type":"uint8"},{"name":"policyNumber","type":"string"},{"name":"warrantyPrice","type":"uint256"},{"name":"claimCount","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"productId","type":"string"},{"name":"serialNumber","type":"string"},{"name":"insurance","type":"address"},{"name":"startDate","type":"uint256"},{"name":"endDate","type":"uint256"},{"name":"productPrice","type":"uint256"}],"name":"createWarranty","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getRole","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"productId","type":"string"},{"name":"serialNumber","type":"string"},{"name":"insurance","type":"address"},{"name":"idx","type":"uint256"}],"name":"getClaim","outputs":[{"name":"retailer","type":"address"},{"name":"amount","type":"uint256"},{"name":"description","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"insurance","type":"address"},{"name":"retailer","type":"address"}],"name":"isRegisteredRetailer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"insurance","type":"address"}],"name":"isInsurance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"insurance","type":"address"},{"name":"productId","type":"string"},{"name":"serialNumber","type":"string"}],"name":"isWarrantyValid","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_insuranceManager","type":"address"},{"name":"_retailerManager","type":"address"}],"name":"setSubContractAddresses","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"productId","type":"string"},{"name":"serialNumber","type":"string"},{"name":"policyNumber","type":"string"}],"name":"confirmWarranty","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"productId","type":"string"},{"name":"serialNumber","type":"string"},{"name":"insurance","type":"address"},{"name":"amount","type":"uint256"},{"name":"description","type":"string"}],"name":"createClaim","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"productId","type":"string"},{"name":"serialNumber","type":"string"},{"name":"insuranceAddress","type":"address"}],"name":"cancelWarranty","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_insuranceManager","type":"address"},{"name":"_retailerManager","type":"address"}],"payable":false,"type":"constructor"}], address: "0xefe50744ac11220d14adb7d94abd2d500ece4ab3"};
const insuranceManager = {abi:[{"constant":true,"inputs":[{"name":"insuranceAddress","type":"address"}],"name":"getInsuranceStatus","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"insuranceCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"insuranceAddress","type":"address"}],"name":"getInsuranceByAddress","outputs":[{"name":"name","type":"string"},{"name":"","type":"address"},{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"priceCalculator","type":"address"}],"name":"createInsurance","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"insurance","type":"address"},{"name":"retailer","type":"address"},{"name":"amount","type":"uint256"}],"name":"decreasePaymentsBalance","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"insurance","type":"address"},{"name":"retailer","type":"address"},{"name":"amount","type":"uint256"}],"name":"increasePaymentsBalance","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"insurance","type":"address"},{"name":"retailer","type":"address"},{"name":"amount","type":"uint256"}],"name":"decreaseSalesBalance","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"insuranceAddress","type":"address"},{"name":"status","type":"uint8"}],"name":"setInsuranceState","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getInsurance","outputs":[{"name":"name","type":"string"},{"name":"","type":"address"},{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"insurance","type":"address"},{"name":"retailer","type":"address"},{"name":"amount","type":"uint256"}],"name":"increaseSalesBalance","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"insurance","type":"address"}],"name":"isInsurance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"insurance","type":"address"},{"name":"retailer","type":"address"},{"name":"amount","type":"uint256"}],"name":"decreaseClaimsBalance","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"insuranceAddress","type":"address"},{"name":"productId","type":"string"},{"name":"startDate","type":"uint256"},{"name":"endDate","type":"uint256"},{"name":"productPrice","type":"uint256"}],"name":"getWarrantyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"insurance","type":"address"},{"name":"retailer","type":"address"},{"name":"amount","type":"uint256"}],"name":"increaseClaimsBalance","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"insurance","type":"address"},{"indexed":false,"name":"status","type":"uint8"}],"name":"InsuranceStatusChanged","type":"event"}], address: "0x96cc4e4e601c76bd7b881d5c7dd2f260b76f5043"};
const retailerManager = {abi:[{"constant":false,"inputs":[{"name":"retailer","type":"address"},{"name":"status","type":"uint8"}],"name":"setRequestState","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"retailer","type":"address"},{"name":"insurance","type":"address"}],"name":"getRetailerStatus","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"companyName","type":"string"},{"name":"insurance","type":"address"}],"name":"requestRegistration","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"retailer","type":"address"},{"name":"insurance","type":"address"}],"name":"getRequestState","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"retailer","type":"address"}],"name":"getRetailerStatus","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"retailerCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"retailer","type":"address"},{"name":"insurance","type":"address"},{"name":"amount","type":"uint256"}],"name":"decreasePaymentsBalance","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"retailer","type":"address"},{"name":"insurance","type":"address"},{"name":"amount","type":"uint256"}],"name":"increasePaymentsBalance","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"retailer","type":"address"},{"name":"insurance","type":"address"},{"name":"price","type":"uint256"}],"name":"decreaseSalesBalance","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"},{"name":"insuranceAddress","type":"address"}],"name":"getRetailer","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"retailer","type":"address"},{"name":"insurance","type":"address"},{"name":"price","type":"uint256"}],"name":"increaseSalesBalance","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"insurance","type":"address"}],"name":"isInsurance","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"retailer","type":"address"},{"name":"insurance","type":"address"},{"name":"amount","type":"uint256"}],"name":"decreaseClaimsBalance","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"retailer","type":"address"},{"name":"insurance","type":"address"}],"name":"getRetailerBalances","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"retailerAddress","type":"address"},{"name":"insuranceAddress","type":"address"}],"name":"getRetailerByAddress","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_insuranceManager","type":"address"}],"name":"setSubContractAddresses","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"retailer","type":"address"},{"name":"insurance","type":"address"},{"name":"amount","type":"uint256"}],"name":"increaseClaimsBalance","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_insuranceManager","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"companyName","type":"string"},{"indexed":false,"name":"retailerAddress","type":"address"},{"indexed":true,"name":"insurance","type":"address"}],"name":"RetailerRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"retailer","type":"address"},{"indexed":true,"name":"insurance","type":"address"},{"indexed":false,"name":"status","type":"uint8"}],"name":"RetailerStatusChanged","type":"event"}], address: "0xd73f9e464ec5301acc8a58015c595fb60f18cab0"};
export {insureChain, insuranceManager, retailerManager};