var userArgs = process.argv.slice(2);
var async = require("async")
var Item = require("./models/item")
var Category = require("./models/category")

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
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
      categoryCreate("Socks", "Here we have socks", callback);
    },
    function (callback) {
      categoryCreate("Shirts", "Here we have shirts", callback);
    },
    function (callback) {
      categoryCreate("Skirts", "Here we have skirts", callback);
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
      itemCreate("Pink sock", "It"s a pink sock", 145, categories[0], 6, callback);
    },
    function (callback) {
      itemCreate("Red table", "It"s a red table", 122, categories[1], 3, callback);
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
