pragma solidity ^0.4.2;

contract PriceCalculator {

	function getPrice(string manufacturer, string productType, uint price) constant returns(uint) {
		return price * 5 / 100;
	}
}

contract Epam {

	struct Product {
		string manufacturer;
		string productType;
		address customer;
		string warrantyId;
		uint warrantyEndDate;
	}

	address owner;
	mapping(string => Product) products;
	PriceCalculator calculator;

	modifier ownerOnly {
		if(msg.sender != owner) {
			throw;
		}
		_;
	}

	modifier noWarranty(string serial) {
		if(!isWarrantyValid(serial)) {
			throw;
		}
		_;
	}

	function Epam() {
		owner = msg.sender;
	}

	function updateCalculator(address contractAddress) ownerOnly {
		calculator = PriceCalculator(contractAddress);
	}

	function requestWarranty(string serial, address customer, uint endDate) noWarranty(serial) {
		products[serial].customer = customer;
		products[serial].warrantyEndDate = endDate;
	}

	function isWarrantyValid(string serial) constant returns (bool) {
		return products[serial].warrantyEndDate < now;
	}

	function getEndDate(string serial) constant returns (uint) {
		return products[serial].warrantyEndDate;
	}

	function getCustomer(string serial) constant returns (address) {
		return products[serial].customer;
	}

}