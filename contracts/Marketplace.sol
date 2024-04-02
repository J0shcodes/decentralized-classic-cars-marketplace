// SPDX-License-Identifier: MIT

pragma solidity >= 0.7.0 <0.9.0;

// interface IERC20Token {
//   function transfer(address, uint256) external returns (bool);
//   function approve(address, uint256) external returns (bool);
//   function transferFrom(address, address, uint256) external returns (bool);
//   function totalSupply() external view returns (uint256);
//   function balanceOf(address) external view returns (uint256);
//   function allowance(address, address) external view returns (uint256);

//   event Transfer(address indexed from, address indexed to, uint256 value);
//   event Approval(address indexed owner, address indexed spender, uint256 value);
// }

struct ClassicCar {
    uint256 id;
    string make;
    string model;
    string imageUrl;
    string year;
    address seller;
    uint256 price;
    string description;
    // string location;
    bool isSold;
}

contract ClassicCarsMarketplace {
    
    ClassicCar[] public classicCars;
    uint256 public nextCarId;
    // address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    // Mapping of sellers to list of cars they own or have sold
    mapping(address => uint256[]) public sellerCars;

    mapping(uint256 => address) public carToSeller;

    // Gets called when a car has been successfully uploaded
    event carListed(
        uint256 carId,
        string make,
        string model,
        string imageUrl,
        string year,
        uint256 price,
        address seller
    );

    // Gets called when a car has been successfully sold
    event carSold(uint256 carId, address buyer, uint256 price);

    // Allows potential sellers to upload a car for sale
    function listCar(
        string memory _make,
        string memory _model,
        string memory _imageUrl,
        string memory _year,
        uint256 _price,
        string memory description
        // string memory location
    ) public {
        ClassicCar memory newCar = ClassicCar(nextCarId, _make, _model, _imageUrl, _year, msg.sender, _price, description, false);
        classicCars.push(newCar);
        sellerCars[msg.sender].push(nextCarId);
        carToSeller[nextCarId] = msg.sender;

        emit carListed(nextCarId, _make, _model, _imageUrl, _year, _price, msg.sender);
        nextCarId++;

    }

    // Allows potential buyers to purchase a car
    function buyCar(uint256 carId) external payable {
        ClassicCar memory car = classicCars[carId];
        require(!car.isSold, "This car has already been sold");
        require(msg.value >= car.price, "Insufficient funds");
        require(msg.sender != car.seller, "You can't buy your own car");

        (bool sent, ) = car.seller.call{value: msg.value}("");
        require(sent, "Transaction failed");        

        classicCars[carId] = classicCars[classicCars.length - 1];
        classicCars.pop();

        car.isSold = true;
        emit carSold(carId, msg.sender, car.price);

        // if(msg.value > car.price) {
        //     payable(msg.sender).transfer(msg.value - car.price);
        // }
    }

    // Returns the number of cars in the database when called
    function getNumberOfCars() external view returns (uint256) {
        return classicCars.length;
    }

    // Returns the details of a particular car when called
    function getCarDetails(uint256 carId) external view returns (ClassicCar memory) {
        return classicCars[carId];
    }

    function getSellerCars(address _seller) public view returns (uint256[] memory) {
        return sellerCars[_seller];
    }

    // Returns an array of cars listed on the marketplace when called
    function getAllListedCars() external view returns (ClassicCar[] memory) {
        return classicCars;
    }

    function removeCar(uint256 carId) external {
        ClassicCar memory car = classicCars[carId];
        require(!car.isSold, "This car has already been sold.");
        require(msg.sender == car.seller, "You do not own this car");

        // Removes the car from the array of cars in the database
        classicCars[carId] = classicCars[classicCars.length - 1];
        classicCars.pop();
    }
}
