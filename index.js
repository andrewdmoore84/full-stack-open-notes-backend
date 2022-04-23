const express = require('express');
const app = express();

const cors = require('cors');

app.use(express.json());
app.use(requestLogger);
app.use(cors());

function requestLogger(request, response, next) {
  console.log('Method: ', request.method);
  console.log('Path:   ', request.path);
  console.log('Body:   ', request.body);
  console.log('---');
  next();
}

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  },
];

const generateID = notes.length > 0
  ? (Math.max(...notes.map(note => note.id))) + 1
  : 0;

app.get('/', (request, response) => {
  response.send('<h1>Hello, world!</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.statusMessage = `Note id#${id} not found`;
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const noteToDelete = notes.find(note => note.id === id);

  if (noteToDelete) {
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
  } else {
    response.statusMessage = `Note id#${id} not found`;
    response.status(404).end();
  }
});

app.post('/api/notes', (request, response) => {
  const noteInfo = request.body;

  if (!noteInfo.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const newNote = {
    id: generateID(),
    date: new Date(),
    content: noteInfo.content,
    important: noteInfo.important || false,
  };

  notes = notes.concat(newNote);

  console.log(newNote);
  response.json(newNote);
});

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
