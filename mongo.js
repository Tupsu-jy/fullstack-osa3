const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://ylinenjaakko:${password}@cluster0-sbedh.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Note = mongoose.model('Note', noteSchema)

if(process.argv.length==5){
    const note = new Note({
        "name": process.argv[3],
        "number": process.argv[4]
    })
    console.log("added "+process.argv[3]+" number "+process.argv[4]+" to phonebook")

    note.save().then(response => {
        console.log('note saved!')
        mongoose.connection.close()
    })
}else{
    Note.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(note => {
          console.log(note.name+" "+note.number)
        })
        mongoose.connection.close()
      })
}
