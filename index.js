
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan');
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

app.use(express.json()) 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))


let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

const generateId = () => {
  /*
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
    */
  return Math.round(Math.random()*Number.MAX_SAFE_INTEGER)
}


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name | !body.number) {
    return response.status(400).json({ 
      error: 'necessary content missing' 
    })
  }


  if(0!=persons.filter(person => person.name === body.name).length){
    return response.status(400).json({ 
      error: 'name alreadyu there' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has ${persons.length} people.<br>${Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = persons.find(note => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})