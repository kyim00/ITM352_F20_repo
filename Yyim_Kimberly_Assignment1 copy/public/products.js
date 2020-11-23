/* Kimberly Yim's Assignment 1: Product array */
var products = 
[
  {
    "name": "Simple Hoop Earrings",
    "price": 50.00,
    "image": "images/hoops_earrings.jpg"
  },
  {
    "name": "Double Hoop Earrings",
    "price": 52.00,      
    "image": "images/double_earrings.jpg"
  },
  {
    "name": "Safety Pin Earrings",
    "price": 54.00,      
    "image": "images/pin_earrings.jpg"
  },
  {
    "name": "Evergreen Wreath Earrings",
    "price": 56.00,
    "image": "images/evergreen_earrings.jpg"
  },
  {
    "name": "Pearl Laurel Wreath Earrings",
    "price": 58.00,
    "image": "images/laurel_earrings.jpg"
  },
  {
    "name": "Gold Daffodil Earrings",
    "price": 60.00,
    "image": "images/daffodil_earrings.jpg"
  }
];

if (typeof module != 'undefined') {
    module.exports.products = products;
}