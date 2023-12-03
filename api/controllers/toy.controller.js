const { ToyModel } = require("../models/toy.model");
const { validateToy } = require("../validation/toyValidation");

exports.searchToy = async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let queryS = req.query.s;
    let searchReg = new RegExp(queryS, "i")
    // {$or:[{name:searchReg}, {manufacturer:searchReg},{info:searchReg}]}
    let data = await ToyModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
}
exports.getToy = async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let data = await ToyModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
}
exports.toysByPrice = async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "price"
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let minP = req.query.min;
    let maxP = req.query.max;
    if (minP && maxP) {
      let data = await ToyModel.find({ $and: [{ price: { $gte: minP } }, { price: { $lte: maxP } }] })

        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    }
    else if (maxP) {
      let data = await ToyModel.find({ price: { $lte: maxP } })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    } else if (minP) {
      let data = await ToyModel.find({ price: { $gte: minP } })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    } else {
      let data = await ToyModel.find({})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
}
exports.toyByCategory = async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let catN = req.params.catName;
    let data = await ToyModel.find({ category: catN })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
}
// Request by category to add
exports.addToy = async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = new ToyModel(req.body);
    // add the user_id of the user that add the toy
    toy.user_id = req.tokenData._id;
    console.log("req.tokenData._id", req.tokenData._id)
    await toy.save();
    res.status(201).json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
}
exports.editToy = async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let editId = req.params.editId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToyModel.updateOne({ _id: editId }, req.body)
    }
    else {
      data = await ToyModel.findOneAndUpdate(
        { _id: editId, user_id: req.tokenData._id },
        req.body,
        { new: true } // This option returns the modified document
      );

    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
}
exports.deleteToy = async (req, res) => {
  try {
    let delId = req.params.delId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToyModel.findOneAndDelete({ _id: delId })
    }
    else {
      data = await ToyModel.findOneAndDelete({ _id: delId, user_id: req.tokenData._id } );
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
}
