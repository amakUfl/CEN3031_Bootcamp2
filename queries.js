/* Add all the required libraries*/

/* Connect to your database using mongoose - remember to keep your key secret*/

/* Fill out these functions using Mongoose queries*/
//Check out - https://mongoosejs.com/docs/queries.html
var mongoose = require('mongoose'), 
    config = require('./config'),
    Listing = require('./ListingSchema.js'),
    collection;
// connection
var connect = async () => {
  await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(async() => collection = await mongoose.connection.useDb(config.db.database).collection(config.db.collection));
  return mongoose.connection;
};

var findLibraryWest = async function() {
  /* 
    Find the document that contains data corresponding to Library West,
    then log it to the console. 
   */
  await collection.findOne({'name': 'Library West'}).then(entry => {
    console.log(`\nfindLibraryWest -- Document that contains data corresponding to Library West:\n`);
    console.log(entry);
    console.log('\n');
  });
};
var removeCable = async function() {
  /*
    Find the document with the code 'CABL'. This cooresponds with courses that can only be viewed 
    on cable TV. Since we live in the 21st century and most courses are now web based, go ahead
    and remove this listing from your database and log the document to the console. 
   */
  await collection.findOne({'code': 'CABL'}).then(async entry => {
    if (entry && entry._id)
      await Listing.deleteOne({_id: entry._id}).then(result => {
        if (result.ok != 1 || result.deletedCount == 0) return;
        console.log(`\nremoveCable -- Document that contains data corresponding to CABL:\n`);
        console.log(entry);
        console.log('\n');
      });
    else console.error('removeCable -- CABL record is missing!\n');
  });
};
var updatePhelpsMemorial = async function() {
  /*
    Phelps Lab address is incorrect. Find the listing, update it, and then 
    log the updated document to the console. 
    
    Correct Address: 1953 Museum Rd, Gainesville, FL 32603

   */
  var updated = await Listing.findOneAndUpdate({name: 'Phelps Laboratory'}, {address: '1953 Museum Rd, Gainesville, FL 32603'}, {new: true, useFindAndModify: true});
  if (updated) {
    console.log(`\nupdatePhelpsMemorial -- Document Phelps Laboratory was updated:\n`);
    console.log(updated);
    console.log('\n');
  } else console.error('updatePhelpsMemorial -- Phelps Laboratory record is missing!\n');
};
var retrieveAllListings = async function() {
  /* 
    Retrieve all listings in the database, and log them to the console. 
   */
  await Listing.find({}, (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`\nretrieveAllListings -- Documents in the database:\n`);
    console.log(results);
    console.log('\n');
  });
};

// connecting
connect().then(async (conn) => {
  await findLibraryWest();
  await removeCable();
  await updatePhelpsMemorial();
  await retrieveAllListings();
  conn.close();
  return;
});
