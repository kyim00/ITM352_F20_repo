/* Kimberly Yim's Assignment 2: Product array */
var products = 
[
  {
    "product_name": "Simple Hoop Earrings",
    "price": 50.00,
    "image": "images/hoops_earrings.jpg"
  },
  {
    "product_name": "Double Hoop Earrings",
    "price": 52.00,      
    "image": "images/double_earrings.jpg"
  },
  {
    "product_name": "Safety Pin Earrings",
    "price": 54.00,      
    "image": "images/pin_earrings.jpg"
  },
  {
    "product_name": "Evergreen Wreath Earrings",
    "price": 56.00,
    "image": "images/evergreen_earrings.jpg"
  },
  {
    "product_name": "Pearl Laurel Wreath Earrings",
    "price": 58.00,
    "image": "images/laurel_earrings.jpg"
  },
  {
    "product_name": "Gold Daffodil Earrings",
    "price": 60.00,
    "image": "images/daffodil_earrings.jpg"
  }
];

if (typeof module != 'undefined') {
    module.exports.products = products;
}