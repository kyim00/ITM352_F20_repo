/* Kimberly Yim's Assignment 3: Product array */

var earrings = 
[
  {
    "item": "Simple Hoop Earrings",
    "price": 50.00,
    "image": "images/earring_hoops.jpg"
  },
  {
    "item": "Double Hoop Earrings",
    "price": 52.00,      
    "image": "images/earring_double.jpg"
  },
  {
    "item": "Safety Pin Earrings",
    "price": 54.00,      
    "image": "images/earring_pin.jpg"
  },
  {
    "item": "Evergreen Wreath Earrings",
    "price": 56.00,
    "image": "images/earring_evergreen.jpg"
  },
  {
    "item": "Pearl Laurel Wreath Earrings",
    "price": 58.00,
    "image": "images/earring_laurel.jpg"
  },
  {
    "item": "Gold Daisy Earrings",
    "price": 60.00,
    "image": "images/earring_daisy.jpg"
  }
]

var rings = 
[
  {
    "item": "Thin Fuchsia Ring",
    "price": 35.00,
    "image": "images/ring_fuchsia.jpg"
  },
  {
    "item": "Fuchsia Trio Ring",
    "price": 40.00,
    "image": "images/ring_trio.jpg"
  },
  {
    "item": "Gold Daisy Ring",
    "price": 45.00,
    "image": "images/ring_daisy.jpg"
  },
  {
    "item": "Square Aqua Ring",
    "price": 50.00,
    "image": "images/ring_aqua.jpg"
  },
  {
    "item": "Pearl and Jewel Ring",
    "price": 55.00,
    "image": "images/ring_pearl.jpg"
  },
  {
    "item": "Gold Crown Ring",
    "price": 60.00,
    "image": "images/ring_crown.jpg"
  }
]

var necklaces = 
[
  {
    "item": "Gold Tag Necklace",
    "price": 44.00,
    "image": "images/necklace_tag.jpg"
  },
  {
    "item": "Gold Coin Necklace",
    "price": 48.00,
    "image": "images/necklace_coin.jpg"
  },
  {
    "item": "Chunky Double-layered Necklace",
    "price": 52.00,
    "image": "images/necklace_chunky.jpg"
  },
  {
    "item": "Clover Necklace",
    "price": 58.00,
    "image": "images/necklace_clover.jpg"
  },
  {
    "item": "Sparkles Necklace",
    "price": 62.00,
    "image": "images/necklace_sparkles.jpg"
  },
  {
    "item": "Pearl Necklace",
    "price": 66.00,
    "image": "images/necklace_pearls.jpg"
  }
]

var bracelets = 
[
  {
    "item": "Thin Duo Bracelet",
    "price": 36.00,
    "image": "images/bracelet_duo.jpg"
  },
  {
    "item": "Chunky Gold Bracelet",
    "price": 38.00,
    "image": "images/bracelet_chunky.jpg"
  },
  {
    "item": "Gold Coin Bracelet",
    "price": 40.00,
    "image": "images/bracelet_coin.jpg"
  },
  {
    "item": "Seashells Bracelet",
    "price": 42.00,
    "image": "images/bracelet_shells.jpg"
  },
  {
    "item": "Silver Pearl Bracelet",
    "price": 44.00,
    "image": "images/bracelet_pearl.jpg"
  },
  {
    "item": "White Baroque Bracelet",
    "price": 46.00,
    "image": "images/bracelet_baroque.jpg"
  }
]

/* Array of all products */
var products = {
  "Earrings": earrings,
  "Rings": rings,
  "Necklaces": necklaces,
  "Bracelets": bracelets
}

if (typeof module != 'undefined') {
    module.exports.products = products;
}