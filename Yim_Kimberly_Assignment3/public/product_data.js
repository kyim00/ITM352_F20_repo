/* Kimberly Yim's Assignment 3: Product array */

var earrings =
  [
    {
      "name": "Simple Hoop Earrings",
      "price": 50.00,
      "image": "images/earring_hoops.jpg"
    },
    {
      "name": "Double Hoop Earrings",
      "price": 52.00,
      "image": "images/earring_double.jpg"
    },
    {
      "name": "Safety Pin Earrings",
      "price": 54.00,
      "image": "images/earring_pin.jpg"
    },
    {
      "name": "Evergreen Wreath Earrings",
      "price": 56.00,
      "image": "images/earring_evergreen.jpg"
    },
    {
      "name": "Pearl Laurel Wreath Earrings",
      "price": 58.00,
      "image": "images/earring_laurel.jpg"
    },
    {
      "name": "Gold Daisy Earrings",
      "price": 60.00,
      "image": "images/earring_daisy.jpg"
    }
  ]

var rings =
  [
    {
      "name": "Thin Fuchsia Ring",
      "price": 35.00,
      "image": "images/ring_fuchsia.jpg"
    },
    {
      "name": "Fuchsia Trio Ring",
      "price": 40.00,
      "image": "images/ring_trio.jpg"
    },
    {
      "name": "Gold Daisy Ring",
      "price": 45.00,
      "image": "images/ring_daisy.jpg"
    },
    {
      "name": "Square Aqua Ring",
      "price": 50.00,
      "image": "images/ring_aqua.jpg"
    },
    {
      "name": "Pearl and Jewel Ring",
      "price": 55.00,
      "image": "images/ring_pearl.jpg"
    },
    {
      "name": "Gold Crown Ring",
      "price": 60.00,
      "image": "images/ring_crown.jpg"
    }
  ]

var necklaces =
  [
    {
      "name": "Gold Tag Necklace",
      "price": 44.00,
      "image": "images/necklace_tag.jpg"
    },
    {
      "name": "Gold Coin Necklace",
      "price": 48.00,
      "image": "images/necklace_coin.jpg"
    },
    {
      "name": "Chunky Double-layered Necklace",
      "price": 52.00,
      "image": "images/necklace_chunky.jpg"
    },
    {
      "name": "Clover Necklace",
      "price": 58.00,
      "image": "images/necklace_clover.jpg"
    },
    {
      "name": "Sparkles Necklace",
      "price": 62.00,
      "image": "images/necklace_sparkles.jpg"
    },
    {
      "name": "Pearl Necklace",
      "price": 66.00,
      "image": "images/necklace_pearls.jpg"
    }
  ]

var bracelets =
  [
    {
      "name": "Seashells Bracelet",
      "price": 42.00,
      "image": "images/bracelet_shells.jpg"
    },
    {
      "name": "Silver Pearl Bracelet",
      "price": 44.00,
      "image": "images/bracelet_pearl.jpg"
    },
    {
      "name": "White Baroque Bracelet",
      "price": 46.00,
      "image": "images/bracelet_baroque.jpg"
    }
  ]

/* Array of all products */
var products = {
  "Earrings": earrings,
  "Rings": rings,
  "Necklaces": necklaces,
  "Bracelets": bracelets,
}

if (typeof module != 'undefined') {
  module.exports.products = products;
}