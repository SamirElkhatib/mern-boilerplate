const mongoose = require("mongoose");

const MONGOURI = process.env.MONGO_URL;

// FIXME: check "useUnifiedTopology: true"

const InitiateMongoConnection = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Database Connection Established Successfully!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoConnection;
