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
  //pakollinen nimi vähintään kolmen merkin merkkijono
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  //pakollinen puhelinnumero muotoa 'DDD DDD DDDD'
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}\d{3}\d{4}/.test(v);
      }
    },
    required: true
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
