//contains the MongoDB schema of repository and CRUD operations
//handles the MongoDb connection and the CRUD operations for the repository model. The fields of the model are:

// owner: The repository owner (company or user)
// name: The repository name
// createdAt: The last release creation date
// resourcePath: The last release path
// tagName: The last release tag
// releaseDescription: Release notes
// homepageUrl: The project’s home URL
// repositoryDescription: The repository description
// avatarUrl: The project owner’s avatar URL

const Mongoose = require("mongoose");
const Config = require("../config/env.config");

const MONGODB_URI = Config.mongoDbUri;

Mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});

const Schema = Mongoose.Schema;

const repositorySchema = new Schema({
  owner: String,
  name: String,
  createdAt: String,
  resourcePath: String,
  tagName: String,
  releaseDescription: String,
  homepageUrl: String,
  repositoryDescription: String,
  avatarUrl: String,
});

repositorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
repositorySchema.set("toJSON", {
  virtuals: true,
});

repositorySchema.findById = function (cb) {
  return this.model("Repository").find(
    {
      id: this.id,
    },
    cb
  );
};

const Repository = Mongoose.model("repository", repositorySchema);

exports.findById = (id) => {
  return Repository.findById(id).then((result) => {
    if (result) {
      result = result.toJSON();
      delete result._id;
      delete result.__v;
      return result;
    }
  });
};

exports.create = (repositoryData) => {
  const repository = new Repository(repositoryData);
  return repository.save();
};

exports.list = () => {
  return new Promise((resolve, reject) => {
    Repository.find().exec(function (err, users) {
      if (err) {
        reject(err);
      } else {
        resolve(users);
      }
    });
  });
};

exports.patchById = (id, repositoryData) => {
  return new Promise((resolve, reject) => {
    Repository.findById(id, function (err, repository) {
      if (err) reject(err);
      for (let i in repositoryData) {
        repository[i] = repositoryData[i];
      }
      repository.save(function (err, updatedRepository) {
        if (err) return reject(err);
        resolve(updatedRepository);
      });
    });
  });
};

exports.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    Repository.deleteOne(
      {
        _id: id,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(err);
        }
      }
    );
  });
};

exports.findByOwnerAndName = (owner, name) => {
  return Repository.find({
    owner: owner,
    name: name,
  });
};
