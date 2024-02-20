
require('dotenv').config(); 
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const siteCollection = await mongodb.getDatabase().db().collection("site").find().toArray();
    const sunshineCollection = await mongodb.getDatabase().db().collection("sunshine").find().toArray();
    const moonCollection = await mongodb.getDatabase().db().collection("moon").find().toArray();
    const beautyCollection = await mongodb.getDatabase().db().collection("beauty").find().toArray();

    const allCollections = {
      site: siteCollection,
      sunshine: sunshineCollection,
      moon: moonCollection,
      beauty: beautyCollection
    };

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(allCollections);
  } catch (error) {
    res.status(500).json({ error: error.message || "Some error occurred while fetching collections." });
  }
};

const getSingle = async (req, res) => {
  try {
    const siteId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection("site").find({ _id: siteId }).toArray();
    if (result.length > 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: "Site not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Some error occurred while fetching the site." });
  }
};

const createSite = async (req, res) => {
  try {
    const site = {
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      images: req.body.images,
      rating: req.body.rating,
      reviews: req.body.review,
    };
    const response = await mongodb.getDatabase().db().collection("site").insertOne(site);
    if (response.acknowledged) {
      res.status(201).json({ message: "Site created successfully", siteId: response.insertedId });
    } else {
      res.status(500).json(response.error || "Some error occurred while creating the site.");
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Some error occurred while creating the site." });
  }
};

const updateSite = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json("Must use a valid site id to update a site.");
    }
    const siteId = new ObjectId(req.params.id);
    const site = {
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      images: req.body.images,
      rating: req.body.rating,
      reviews: req.body.review,
    };
    const response = await mongodb.getDatabase().db().collection("site").replaceOne({ _id: siteId }, site);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Site not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Some error occurred while updating the site." });
  }
};

const deleteSite = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json("Must use a valid site id to delete a site.");
    }
    const siteId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection("site").deleteOne({ _id: siteId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Site not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Some error occurred while deleting the site." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createSite,
  updateSite,
  deleteSite,
};

