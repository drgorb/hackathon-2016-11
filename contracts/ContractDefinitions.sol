pragma solidity ^0.4.4;

contract owned {
    address owner;

    modifier ownerOnly() {
        if (msg.sender != owner) throw;
        _;
    }

    function owned() {
        owner = msg.sender;
    }

    function getOwner() constant returns (address) {
        return owner;
    }
}

contract mortal is owned {
    function kill() {
        if (msg.sender == owner) selfdestruct(owner);
    }
}

contract stateful {
    enum RetailerStatus {Undefined, Requested, Accepted, Rejected, Terminated}
    enum InsuranceStatus {Undefined, Requested, Active, Terminated}
    enum WarrantyStatus {Undefined, Created, Confirmed, Canceled}
    enum UserRole {Undefined, Retailer, Insurance, Owner}
}

contract InsuranceManager is owned, stateful {
    struct Insurance {
        string name;
        InsuranceStatus status;
    }

    mapping (address => Insurance) insurances;
    mapping (uint=>address) insuranceList;
    uint public insuranceCount;

    event InsuranceStatusChanged(
        address indexed insurance,
        InsuranceStatus status
    );

    function isInsurance(address insurance) constant returns (bool) {
        return insurances[insurance].status != InsuranceStatus.Undefined;
    }

    function createInsurance(string name) {
        Insurance insurance = insurances[msg.sender];
        InsuranceStatus previousStatus = insurance.status;
        insurance.status = InsuranceStatus.Requested;
        if(previousStatus != InsuranceStatus.Undefined) throw;

        insurance.name = name;
        insuranceList[insuranceCount++] = msg.sender;

        InsuranceStatusChanged(msg.sender, InsuranceStatus.Requested);
    }

    function setInsuranceState(address insuranceAddress, InsuranceStatus status) ownerOnly {
        Insurance insurance = insurances[insuranceAddress];
        if(insurance.status == InsuranceStatus.Undefined) throw;

        insurance.status = status;
    }

    function getInsurance(uint index) constant returns (string name, address, InsuranceStatus) {
        Insurance insurance = insurances[insuranceList[index]];
        return (insurance.name, insuranceList[index], insurance.status);
    }

    function getInsuranceStatus(address insuranceAddress) constant returns (InsuranceStatus) {
        return insurances[insuranceAddress].status;
    }

}

contract RetailerManager is owned, stateful {
    InsuranceManager insuranceManager;

    function RetailerManager(address _insuranceManager){
        insuranceManager = InsuranceManager(_insuranceManager);
    }
    
    function setSubContractAddresses (address _insuranceManager) ownerOnly {
        insuranceManager = InsuranceManager(_insuranceManager);
    }

    struct PartnerRelations {
        RetailerStatus status;
        uint sales /*the total amount of policies sold by retailer*/;
        uint payments /*the total amount paid by retailer*/;
        uint claims /*the total amount the insurance has paid to the retailer in claims*/;
    }

    modifier insuranceOnly {
        if(!isInsurance(msg.sender)) throw;
        _;
    }

    function isInsurance(address insurance) constant returns (bool) {
        return insuranceManager.getInsuranceStatus(insurance) != InsuranceStatus.Undefined;
    }

    struct Retailer {
        string companyName;
        mapping (address=>PartnerRelations) partnerRelations /*the mapping holds the relation of the partner with each insurance company*/;
        RetailerStatus status/*in order to easily check for the existence of a retailer the first status is also set on the retailer itself*/;
    }

    mapping (address=>Retailer) retailers;
    mapping (uint=>address) retailerList;
    uint public retailerCount;

    event RetailerRequest(
        string indexed companyName,
        address retailerAddress,
        address indexed insurance
    );

    event RetailerStatusChanged(
        address indexed retailer,
        address indexed insurance,
        RetailerStatus status
    );

    /**
    the retailer send a transaction to request registration with an insurer
    */
    function requestRegistration(string companyName, address insurance) {
        Retailer retailer = retailers[msg.sender];
        retailer.companyName = companyName;
        /*make sure the insurance company exists*/
        if(insuranceManager.getInsuranceStatus(insurance) != InsuranceStatus.Active) {
            throw;
        }
        /*make sure no previous request was made*/
        if(retailer.partnerRelations[insurance].status != RetailerStatus.Undefined){
            throw;
        }

        retailerList[retailerCount++] = msg.sender;
        retailer.partnerRelations[insurance].status = RetailerStatus.Requested;
        retailer.status = RetailerStatus.Accepted;
        retailers[msg.sender] = retailer;
        RetailerRequest(companyName, msg.sender, insurance);
    }

    function getRequestState(address retailer, address insurance) constant returns (RetailerStatus) {
        return retailers[retailer].partnerRelations[insurance].status;
    }

    /**
    sets the status of a retailer's request.
    only the insurance to which the request was made can do this
    */
    function setRequestState(address retailer, RetailerStatus status) insuranceOnly {
        retailers[retailer].partnerRelations[msg.sender].status = status;
        RetailerStatusChanged(retailer, msg.sender, status);
    }

    function getRetailerStatus(address retailer, address insurance) returns (RetailerStatus){
        return retailers[retailer].partnerRelations[insurance].status;
    }

    function getRetailerStatus(address retailer) returns (RetailerStatus){
        return retailers[retailer].status;
    }

    /**
    get the nth retailer in the list
    */
    function getRetailer(uint index) constant returns (address, string, RetailerStatus) {
        return (retailerList[index], retailers[retailerList[index]].companyName, retailers[retailerList[index]].status);
    }

    function getRetailerBalances(address retailer, address insurance) constant returns (uint, uint, uint) {
        PartnerRelations partnerRelation = retailers[retailer].partnerRelations[insurance];
        return (partnerRelation.sales, partnerRelation.payments, partnerRelation.claims);
    }

    function increaseSalesBalance(address retailer, address insurance, uint price) {
        retailers[retailer].partnerRelations[insurance].sales += price;
    }

    function increaseClaimsBalance(address retailer, address insurance, uint amount) {
        retailers[retailer].partnerRelations[insurance].claims += amount;        
    }
}

contract Insurechain is mortal, stateful{
    InsuranceManager insuranceManager;
    RetailerManager retailerManager;

    function Insurechain(address _insuranceManager, address _retailerManager) {
        insuranceManager = InsuranceManager(_insuranceManager);
        retailerManager = RetailerManager(_retailerManager);
    }

    function setSubContractAddresses (address _insuranceManager, address _retailerManager) ownerOnly {
        insuranceManager = InsuranceManager(_insuranceManager);
        retailerManager = RetailerManager(_retailerManager);
    }

    struct Claim {
        address retailer /*in theory another retailer than the one who sold the insurance can make a claim*/;
        uint amount;
        string description;
    }

    struct Warranty {
        address retailer;
        uint startDate;
        uint endDate;
        string policyNumber;
        WarrantyStatus status;
        uint price;
        mapping (uint => Claim) claims;
        uint claimCount;
    }

    // mapping of insurance -> productId -> serialNumber -> Warranty
    mapping (address=>mapping( string=>mapping( string=>Warranty ))) warranties;

    modifier insuranceOnly {
        if(!isInsurance(msg.sender)) throw;
        _;
    }

    function isInsurance(address insurance) constant returns (bool) {
        return insuranceManager.getInsuranceStatus(insurance) != InsuranceStatus.Undefined;
    }

    modifier registeredRetailerOnly(address insurance) {
        if(!isInsurance(insurance)) throw;
        if(retailerManager.getRetailerStatus(msg.sender, insurance) != RetailerStatus.Accepted) throw;
        _;
    }

    function getRole(address user) constant returns (UserRole) {
        if(user == owner) return UserRole.Owner;
        if(retailerManager.getRetailerStatus(user) == RetailerStatus.Accepted) return UserRole.Retailer;
        if(insuranceManager.getInsuranceStatus(user) == InsuranceStatus.Active) return UserRole.Insurance;

        return UserRole.Undefined;
    }

    /**
        Creates a new warranty.
        productId: The EAN13 that identifies the product
        serialNumber: the particular product serial number
        insurance: the eth address of the insurance
        startDate: start date of the extended warranty
        endDate: start date of the extended warranty
        price: the price in cents
    */
    function createWarranty(string productId, string serialNumber, address insurance, uint startDate, uint endDate, uint price) registeredRetailerOnly(insurance) {
        Warranty warranty = warranties[insurance][productId][serialNumber];
        if(warranty.status != WarrantyStatus.Undefined) throw;

        warranty.status = WarrantyStatus.Created;
        warranty.startDate = startDate;
        warranty.endDate = endDate;
        warranty.price = price;
        warranty.retailer = msg.sender;
        retailerManager.increaseSalesBalance(msg.sender, insurance, price);        
    }

    /**
        Confirms a warranty
        productId: The EAN13 that identifies the product
        serialNumber: the particular product serial number
        policyNumber: the policy number of the warranty
    */
    function confirmWarranty(string productId, string serialNumber, string policyNumber) insuranceOnly {
        Warranty warranty = warranties[msg.sender][productId][serialNumber];
        if(warranty.status != WarrantyStatus.Created) throw;

        warranty.status = WarrantyStatus.Confirmed;
        warranty.policyNumber = policyNumber;
    }

    /**
        Confirms a warranty
        productId: The EAN13 that identifies the product
        serialNumber: the particular product serial number
        policyNumber: the policy number of the warranty
    */
    function cancelWarranty(string productId, string serialNumber) insuranceOnly {
        Warranty warranty = warranties[msg.sender][productId][serialNumber];
        if(warranty.status == WarrantyStatus.Undefined) throw;

        warranty.status = WarrantyStatus.Canceled;
    }

    function getWarranty(string productId, string serialNumber, address insurance) constant returns (uint startDate, uint endDate, WarrantyStatus status, string policyNumber) {
        Warranty warranty = warranties[insurance][productId][serialNumber];
        return (warranty.startDate, warranty.endDate, warranty.status, warranty.policyNumber);
    }

    /**
        create a new claim for an insured product
        productId: The EAN13 that identifies the product
        serialNumber: the particular product serial number
    */
    function createClaim(string productId, string serialNumber, address insurance, uint amount, string description) registeredRetailerOnly(insurance) {
        Warranty warranty = warranties[insurance][productId][serialNumber];
        /*create only works for existing and valid warranties*/
        if(warranty.status != WarrantyStatus.Confirmed || warranty.startDate > now || warranty.endDate < now) throw;

        Claim claim = warranty.claims[warranty.claimCount++];
        claim.retailer = msg.sender;
        claim.amount = amount;
        claim.description = description;

        /*increase the retailer's account*/
        retailerManager.increaseClaimsBalance(msg.sender, insurance, amount);
    }

    function getClaimCount(string productId, string serialNumber, address insurance) constant returns (uint) {
        warranties[insurance][productId][serialNumber].claimCount;
    }

    function getClaim(string productId, string serialNumber, address insurance, uint idx) constant returns (address, uint, string) {
        Claim claim = warranties[insurance][productId][serialNumber].claims[idx];
        return (claim.retailer, claim.amount, claim.description);
    }
}