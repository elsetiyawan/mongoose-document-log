"use strict";
const mongooseModel = require("./logModel");

// need to user this data: {}
let dataToSave = {
  data: {},
};

module.exports = function historyPlugin(schema) {
  schema.pre("save", function (next) {
    this.wasNew = this.isNew;
    next();
  });

  schema.post("save", function () {
    dataToSave.collectionName = this.constructor.modelName;
    dataToSave.operation = "save";
    if (this.wasNew) {
      dataToSave.data.new = this;
    } else {
      dataToSave.data.update = this;
    }
    saveData();
  });

  // find one and update
  schema.pre("findOneAndUpdate", async function () {
    dataToSave.collectionName = this.mongooseCollection.collectionName;
    dataToSave.operation = this.op;
    await this.find(this._conditions)
      .cursor()
      .eachAsync(async (result) => {
        dataToSave.data.before = result;
      });
  });

  schema.post("findOneAndUpdate", async function () {
    dataToSave.collectionName = this.mongooseCollection.collectionName;
    dataToSave.operation = this.op;
    if (dataToSave.data.before && dataToSave.data.before._id) {
      await this.find(dataToSave.data.before._id)
        .cursor()
        .eachAsync(async (result) => {
          dataToSave.data.after = result;
        });
      saveData();
    } else {
      dataToSave = {
        data: {},
      };
    }
  });

  // update
  schema.pre("updateOne", async function () {
    dataToSave.collectionName = this.mongooseCollection.collectionName;
    dataToSave.operation = this.op;
    await this.find(this._conditions)
      .cursor()
      .eachAsync(async (result) => {
        dataToSave.data.before = result;
      });
  });

  schema.post("updateOne", async function () {
    dataToSave.collectionName = this.mongooseCollection.collectionName;
    dataToSave.operation = this.op;
    if (dataToSave.data.before && dataToSave.data.before._id) {
      await this.find(dataToSave.data.before._id)
        .cursor()
        .eachAsync(async (result) => {
          dataToSave.data.after = result;
        });
      saveData();
    } else {
      dataToSave = {
        data: {},
      };
    }
  });

  // update
  schema.pre("update", async function () {
    dataToSave.collectionName = this.mongooseCollection.collectionName;
    dataToSave.operation = this.op;
    await this.find(this._conditions)
      .cursor()
      .eachAsync(async (result) => {
        dataToSave.data.before = result;
      });
  });

  schema.post("update", async function () {
    dataToSave.collectionName = this.mongooseCollection.collectionName;
    dataToSave.operation = this.op;
    if (dataToSave.data.before && dataToSave.data.before._id) {
      await this.find(dataToSave.data.before._id)
        .cursor()
        .eachAsync(async (result) => {
          dataToSave.data.after = result;
        });
      saveData();
    } else {
      dataToSave = {
        data: {},
      };
    }
  });
};

const saveData = async () => {
  await new mongooseModel(dataToSave).save();
  dataToSave = {
    data: {},
  };
};
