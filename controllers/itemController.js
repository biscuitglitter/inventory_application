var Item = require("../models/item");
var Category = require("../models/category");
var async = require("async");
const { body,validationResult } = require("express-validator");

exports.index = function(req, res) {
    async.parallel({
        item_count: function(callback) {
            Item.countDocuments({},callback);
        },
        category_count: function(callback) {
            Category.countDocuments({},callback);
        },
    }, function(err, results) {
        res.render("index", { title: "Inventory app", error: err, data: results });
    });
};

// display list of all items
exports.item_list = function(req, res, next) {
    Item.find({}, "title category price number_in_stock")
      .sort({title : 1})
      .populate("category").exec(function (err, list_items) {
        if (err) {return next(err)} 
        else {
              // Successful, so render
              res.render("item_list", { title: "All items", item_list: list_items });
          }
      });  
  };  

// display detail page for a specific item
exports.item_detail = function(req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
              .populate("category")
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { // No results.
            var err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render("item_detail", { title: results.item.title, item: results.item } );
    });
};

// display item create form on GET
exports.item_create_get = function(req, res, next) {
    async.parallel({
        items(callback) {
            Item.find(callback);
        },
        categories(callback) {
            Category.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render("item_form", { title: "Create item", items: results.items, categories: results.categories });
    });
};

// item create on POST
exports.item_create_post = [
    // Validate and sanitize fields.
    body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("category", "Category must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("description", "Description must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create a Item object with escaped and trimmed data.
        var item = new Item(
          { title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            _id: req.body.itemid
           });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            // Get all items and categories for form.
            async.parallel({
                categories(callback) {
                    Category.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render("item_form", { title: "Create item", categories: results.categories, item: item, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save item.
            item.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new item record.
                   res.redirect(item.url);
                });
        }
    }
];

exports.item_delete_get = function (req, res, next) {
    async.parallel(
      {
        item: function (callback) {
          Item.findById(req.params.id)
            .populate("title")
            .exec(callback);
        },
      },
      function (err, results) {
        if (err) {
          return next(err);
        }
        if (results.item == null) {
          // No results.
          res.redirect("/catalog/items");
        }
        res.render("item_delete", {
          title: "Delete Item",
          item: results.item,
        });
      }
    );
  };

// Handle film delete on POST.
exports.item_delete_post = function (req, res, next) {
  Item.findById(req.params.id).exec(function (err, results) {
    if (err) {
      return next(err);
    }
    Item.findByIdAndDelete(results, function deleteItem(err) {
      if (err) {
        return next(err);
      }
      // res.json("/items");
      res.redirect("/catalog");
    });
  });
};
  
// Display Item update form on GET.
exports.item_update_get = function(req, res) {
    res.send("NOT IMPLEMENTED: Item update GET");
};

// Handle Item update on POST.
exports.item_update_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Item update POST");
};

