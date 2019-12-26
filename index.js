const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

morgan.token('person', function(req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else {
    return ' ';
  }
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person'
  )
);

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

app.get('/', (req, res) => {
  console.log('bget / alkaa');
  res.send('<h1>Hello World</h1>');
  console.log('bget / loppuu');
});

app.get('/api/persons', (req, res) => {
  console.log('bget /api/persons alkaa');
  res.json(persons);
  console.log('bget /api/persons loppuu');
});

app.get('/info', (req, res) => {
  console.log('bget /info alkaa');
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>${new Date()}<p>`
  );
  console.log('bget /info loppuu');
});

app.get('/api/persons/:id', (req, res) => {
  console.log('bget /api/persons/:id alkaa');

  const id = Number(req.params.id);
  person = persons.find(p => p.id === id);
  if (person) {
    res.send(`<p>Name: ${person.name}</p><p>Number: ${person.number}</p>`);
  } else {
    res.status(404).end();
  }

  console.log('bget /api/persons/:id loppuu');
});

app.delete('/api/persons/:id', (req, res) => {
  console.log('bdelete alkaa');
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);

  res.status(204).end();
  console.log('bdelete loppuu');
});

app.post('/api/persons', (req, res) => {
  console.log('bpost alkaa');

  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: 'name is missing'
    });
  } else if (
    persons.some(p => p.name.toUpperCase() === body.name.toUpperCase())
  ) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number is missing'
    });
  } else if (persons.some(p => p.number === body.number)) {
    return res.status(400).json({
      error: 'number must be unique'
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000) + 1
  };

  persons = persons.concat(person);

  res.json(person);
  console.log('bpost loppuu');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
