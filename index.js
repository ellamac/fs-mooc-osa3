const express = require('express'); //web-framework
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser'); //http-pyyntöjen parseri
const morgan = require('morgan'); //loggaus
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());

//loggauksen konfiguraatiota
morgan.token('person', function(req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else {
    return ' ';
  }
});

//morganin käyttö tiny-kongfiguraation mukaisesti
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person'
  )
);

/*
let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
];
*/

/* HELLO WORLD */
app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

/* KAIKKI HENKILÖT*/
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
});

/* PUHELINNUMEROIDEN MÄÄRÄ JA PVM */
app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count =>
    res.send(`<p>Phonebook has info for ${count} people</p>${new Date()}<p>`)
  );
});

/* YHDEN HENKILÖN TIEDOT ID:N PERUSTEELLA */
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      next(error);
    });
});

/* HENKILÖN LISÄÄMINEN */
app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  // uusi person-objekti syötetyillä arvoilla
  const person = new Person({
    name: body.name,
    number: body.number
  });

  //lisätään uusi henkilö tietokantaan
  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => res.json(savedAndFormattedPerson))
    .catch(error => next(error));
});

/* HENKILÖN MUOKKAUS */
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  //henkilön uudet tiedot
  const person = {
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    runValidators: true,
    context: 'query'
  })
    .then(updatedPerson => updatedPerson.toJSON())
    .then(savedAndFormattedPerson => res.json(savedAndFormattedPerson))
    .catch(error => next(error));
});

/* HENKILÖN POISTAMINEN */
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error));
});

// Olemattomien osoitteiden käsittely
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

//Virheidenkäsittelijä
const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  //Virheellinen olio-id
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } //nimi on jo luettelossa
  //muuten oletusvirheenkäsittely
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
