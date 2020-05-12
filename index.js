require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan');
const mongoose = require('mongoose')
const Person = require('./models/person.js')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

app.use(express.json()) 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

/*
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
*/

const generateId = () => {
  /*
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
    */
  return Math.round(Math.random()*Number.MAX_SAFE_INTEGER)
}


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name | !body.number) {
    return response.status(400).json({ 
      error: 'necessary content missing' 
    })
  }
  /*
  Person.find({}).
    then(persons => {
     
  if(0!=persons.filter(person => person.name === body.name).length){
    return response.status(400).json({ 
      error: 'name alreadyu there' 
    })
  }*/

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    console.log("save")
    response.json(savedPerson.toJSON())
  }).catch(error => next(error))
  
  
})

app.get('/info', (req, res) => {
  Person.find({}).then(notes => {
    res.send(`<p>Phonebook has ${notes.length} people.<br>${Date()}</p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {

  Person.findById(req.params.id).then(note => {
    
    if (note) {
      console.log(note)
      res.json(note.toJSON())
    } else {
      res.status(404).end()
    }

  }).catch(error => next(error))
  //const id = Number(req.params.id)
  //const note = persons.find(note => note.id === id)

})

app.delete('/api/persons/:id', (request, response, next) => {
  //const id = Number(request.params.id)
  //persons = persons.filter(note => note.id !== id)
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(notes => {
    res.json(notes)
    console.log(notes.length+"asd")
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const note = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  console.log("ue")
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log("eh")
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidatorError' ){
    return response.status(400).send({ error: error.message })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})