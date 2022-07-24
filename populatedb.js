#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith("mongodb")) {
    console.log("ERROR: You need to specify a valid mongodb URL as the first argument");
    return
}
*/

var async = require("async")
var Item = require("./models/item")
var Category = require("./models/category")

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = []
var categories = []

function categoryCreate(name, description, cb) {
  categorydetail = {
    name: name,
    description: description,
  }

  var category = new Category(categorydetail);
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log("New Category: " + category);
    categories.push(category)
    cb(null, category)
  });
}

function createCategories(cb) {
  async.parallel([
    function (callback) {
      categoryCreate("Clothes", "Here we have clothes", callback);
    },
    function (callback) {
      categoryCreate("Perfume", "Here we have perfumes", callback);
    },
    function (callback) {
      categoryCreate("Furniture", "Here we have furniture", callback);
    }
  ],
    // optional callback
    cb);
}

function itemCreate(title, description, price, category, number_in_stock, cb) {
  itemdetail = {
    title: title,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  }

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log("New Item: " + item);
    items.push(item)
    cb(null, item)
  });
}


function createItems(cb) {
  async.parallel([
    function (callback) {
      itemCreate("Pink T-shirt", "It's a pink T-shirt", 50, categories[2], 4, callback);
    },
    function (callback) {
      itemCreate("Red table", "It's a red table", 240, categories[1], 3, callback);
    },
    function (callback) {
      itemCreate("Blue closet", "It's a blue closet", 325, categories[1], 2, callback);
    }
  ],
    // optional callback
    cb);
}

async.series([
  createCategories,
  createItems,
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    }
    else {
      console.log("Items: " + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  });
