import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {

  const [notes, setNotes] = useState([])

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: ""
  });

  console.log("hello")

  // FETCHING - Notes
  function fetchNotes() {
    axios.get('http://localhost:3000/notes')
      .then((res) => {
        setNotes(res.data.notes)
      })
  }


  // USE EFFECT - fetching all notes (side effects)
  useEffect(() => {
    fetchNotes();
  }, [])

  // CREATING - Note
  function handlesubmit(e) {
    e.preventDefault()

    const { title, description } = e.target.elements;

    console.log(title.value, description.value);

    axios.post("http://localhost:3000/notes", {
      title: title.value,
      description: description.value
    })
      .then((res) => {
        console.log(res.data);
        setNotes(prev => [...prev, res.data.note])
      })
  }

  // DELETING - Note
  function handleDeleteNote(noteId) {
    console.log(noteId);

    axios.delete("http://localhost:3000/notes/" + noteId)
      .then(res => {
        console.log(res.data);
        setNotes(prev => prev.filter(note => note._id !== noteId))
      })
  }
  function handleUpdateOnId(noteId, updatedData) {
    axios.patch(`http://localhost:3000/notes/${noteId}`, updatedData)
      .then(res => {
        console.log("UPDATE RESPONSE:", res.data);
        setNotes(prev =>
          prev.map(note =>
            note._id === noteId ? res.data.note : note
          )
        );
      });
  }

  return (
    <div>
      <form className='note-create-form' onSubmit={handlesubmit}>
        <input name="title" type="text" placeholder='Enter title' />
        <input name="description" type="text" placeholder='Enter description' />
        <button >Create note</button>
      </form>
      <div className="notes">

        {notes.map((note) => (
          <div className="note" key={note._id}>

            {editId === note._id ? (
              <>
                <input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
                <input
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />

                <button onClick={() => {
                  handleUpdateOnId(note._id, editData);
                  setEditId(null); // exit edit mode
                }}>
                  Save
                </button>

                <button onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h1>{note.title}</h1>
                <p>{note.description}</p>

                <button onClick={() => handleDeleteNote(note._id)}>
                  Delete
                </button>

                <button onClick={() => {
                  setEditId(note._id);
                  setEditData({
                    title: note.title,
                    description: note.description
                  });
                }}>
                  Update
                </button>
              </>
            )}

          </div>
        ))}


      </div>
    </div>
  )
}

export default App