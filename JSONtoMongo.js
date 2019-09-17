'use strict';
/* 
  Import modules/files you may need to correctly run the script. 
  Make sure to save your DB's uri in the config file, then import it with a require statement!
 */
var fs = require('fs'),
    mongoose = require('mongoose'), 
    Schema = mongoose.Schema, 
    Listing = require('./ListingSchema.js'), 
    config = require('./config');

/* Connect to your database using mongoose - remember to keep your key secret*/
//see https://mongoosejs.com/docs/connections.html
//See https://docs.atlas.mongodb.com/driver-connection/

// helper function to connect to the MongoDB
async function establishConnection() {
  try {
    await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    // clearing existing records in the collection
      .then(async () => {
        var collection = mongoose.connection.useDb(config.db.database).collection(config.db.collection);
        await collection.deleteMany({});
      // handling error during connection attempt
      }).catch(() => {
        console.error(error);
      });
    // handling error with connection
    mongoose.connection.on('error', err => {
      console.error(err);
    });
  // handling error with connection definition
  } catch (error) {
    console.error(error);
  }
}

/* 
  Instantiate a mongoose model for each listing object in the JSON file, 
  and then save it to your Mongo database 
  //see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

  Remember that we needed to read in a file like we did in Bootcamp Assignment #1.
 */
fs.readFile(config.document.uri, config.document.encoding, async function(err, data) {
  // handling error with reading file
  if (err) console.error(err);
  // parsing data into Object
  data = JSON.parse(data);
  // connecting to the MongoDB
  await establishConnection();
  // when connected - iterate through all entries
  data.entries.forEach(listing => {
    // and write them using custom Schema
    new Listing(listing).save(function(err, listing) {
      // handle error during writing document
      if (err) console.error(err);
    });
  });
});


/*  
  Check to see if it works: Once you've written + run the script, check out your MongoLab database to ensure that 
  it saved everything correctly. 
 */