require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

const app = express();
app.use(express.static('dist'));
app.use(express.json());

// new morgan token and use morgan logger
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(cors());

// Routes
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get('/info', (req, res, next) => {
  const date = new Date();
  Person.find({})
    .then((persons) => {
      res.send(
        `<div>Phonebook has info for ${persons.length} people <br> ${date}</div>`
      );
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name) {
    res.status(400).json({ error: 'name is missing' });
  } else if (!number) {
    res.status(400).json({ error: 'number is missing' });
  } else {
    const person = Person({
      name,
      number,
    });
    person
      .save()
      .then((savedPerson) => {
        res.json(savedPerson);
      })
      .catch((error) => next(error));
  }
});

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Unknown endpoint error handler
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// Error handler
const errorHandler = (err, _req, res, next) => {
  const { name, message } = err;
  console.error({ name, message });

  if (name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (name === 'ValidationError') {
    return res.status(400).json({ error: message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
