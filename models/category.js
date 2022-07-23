const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true }
    }
)

// Virtual for category's URL
categorySchema.virtual("url").get(function () {
    return "/catalog/category/" + this._id;
});

// Export model
module.exports = mongoose.model("Category", categorySchema);