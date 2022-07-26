var Category = require("../models/category");

// Display list of all Categories.
exports.category_list = function(req, res) {
    res.send("NOT IMPLEMENTED: Category list");
};

// Display list of all categories.
exports.category_list = function(req, res, next) {
    Category.find()
      .sort([["name", "ascending"]])
      .exec(function (err, list_categories) {
        if (err) { return next(err); }
        //Successful, so render
        res.render("category_list", { title: "All categories", category_list: list_categories });
      });  
  };

// Display detail page for a specific Category.
exports.category_detail = function(req, res) {
    res.send("NOT IMPLEMENTED: Category detail: " + req.params.id);
};

// Display Category create form on GET.
exports.category_create_get = function(req, res) {
    res.send("NOT IMPLEMENTED: Category create GET");
};

// Handle Category create on POST.
exports.category_create_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Category create POST");
};

// Display Category delete form on GET.
exports.category_delete_get = function(req, res) {
    res.send("NOT IMPLEMENTED: Category delete GET");
};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Category delete POST");
};

// Display Category update form on GET.
exports.category_update_get = function(req, res) {
    res.send("NOT IMPLEMENTED: Category update GET");
};

// Handle Category update on POST.
exports.category_update_post = function(req, res) {
    res.send("NOT IMPLEMENTED: Category update POST");
};