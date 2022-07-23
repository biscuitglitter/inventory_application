const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    number_in_stock: { type: Number, required: true },
  }
)

// Virtual for item's URL
itemSchema.virtual("url").get(function () {
  return "/catalog/item/" + this._id;
});

//Export model
module.exports = mongoose.model("Item", itemSchema);