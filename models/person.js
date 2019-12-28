const mongoose = require('mongoose');

//const url = `mongodb+srv://Ella:3mil@cluster0-xp4o4.mongodb.net/phonebook-app?retryWrites=true`;
const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.set('useFindAndModify', false);

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('connected to MongDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
