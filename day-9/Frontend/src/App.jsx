import React, { useState } from 'react'
import axios from 'axios'

const App = () => {

  const [notes, setNotes] = useState([
    {
      title: "test title11",
      description: "Test description"
    },
    {
      title: "test title 2",
      description: "Test description"
    },
    {
      title: "test title 3",
      description: "Test description"
    },
    {
      title: "test title 4",
      description: "Test description"
    },
    {
      title: "test title 5",
      description: "Test description"
    }
  ])

  axios.get('http://localhost:3000/notes')
  .then((res) => {
    setNotes(res.data.notes)
  })


  return (
    <div>
      <div className="notes">

        {notes.map((note, idx) => (
          <div className="note"key={idx}>
            <h1>{note.title}</h1>
            <p>{note.description}</p>
          </div>
        ))}


      </div>
    </div>
  )
}

export default App