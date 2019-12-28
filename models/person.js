const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); //uniikin attribuutin validointiin

//const url = `mongodb+srv://Ella:3mil@cluster0-xp4o4.mongodb.net/phonebook-app?retryWrites=true`;
const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.set('useFindAndModify', false);

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  //pakollinen nimi vähintään kolmen merkin merkkijono
  name: {
    type: String,
    minlength: [3, 'Name has to have a minimum of 3 letters'],
    required: '{PATH} is required!',
    unique: true
  },
  //pakollinen puhelinnumero muotoa 'DDD DDD DDDD'
  number: {
    type: String,
    minlength: [8, 'Number has to have a minimum of 8 digits'],
    required: true
  }
});

// Apply the uniqueValidator plugin to personSchema.
personSchema.plugin(uniqueValidator, {
  message: 'Expected {PATH} to be unique.'
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
