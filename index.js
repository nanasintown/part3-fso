const express = require('express');
const app = express();

let phoneBook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(phoneBook);
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(
    `<div>Phonebook has info for ${phoneBook.length} people <br> ${date}</div>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const contact = phoneBook.find((c) => c.id === id);
  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.delete('api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  phoneBook = phoneBook.filter((c) => c.id !== id);
  res.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 1000001);
const notUnique = (name) => records.some((r) => r.name === name);

app.post('api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name) {
    res.status(400).json({ error: 'name is missing' });
  } else if (!number) {
    res.status(400).json({ error: 'number is missing' });
  } else if (notUnique(name)) {
    res.status(400).json({ error: 'name must be unique' });
  } else {
    const newRecord = {
      id: generateId(),
      name,
      number,
    };
    records = records.concat(newRecord);
    res.json(newRecord);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
