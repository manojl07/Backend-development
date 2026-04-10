import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])

  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({
    title: "",
    description: ""
  });

  function fetchNotes() {
    axios.get("http://localhost:3000/api/notes")
      .then(res => {
        setNotes(res.data.notes)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchNotes()
  }, [])


  // function handleSubmit(e) {
  //   e.preventDefault();

  //   const title = e.target.title.value;
  //   const description = e.target.description.value;

  //   console.log(title, description);

  //   axios.post("http://localhost:3000/api/notes", {
  //     title,
  //     description
  //   })
  //   .then(res => {
  //     setNotes(prev => [...prev, res.data.note]);
  //   })
  //   .catch(err => console.log(err));

  //   e.target.reset();
  // }

  function handleSubmit(e) {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;

    console.log(title, description);

    axios.post("http://localhost:3000/api/notes", {
      title,
      description
    })
      .then(res => {
        console.log(res.data);
        setNotes(prev => [...prev, res.data.note])
      })
      .catch(err => console.log(err))
    e.target.reset();
  }

  // DELETING - Note 
  function handleOnDelete(noteId) {
    console.log(noteId);

    axios.delete(`http://localhost:3000/api/notes/${noteId}`)
      .then(res => {
        console.log(res.data);
        setNotes(prev => prev.filter(note => note._id !== noteId))
      })
      .catch(err => console.log(err))
  }

  // UPDATE - patch
  function handleUpdateOnId(noteId, updatedData) {
    axios.patch(`http://localhost:3000/api/notes/${noteId}`, updatedData)
      .then(res => {
        console.log("UPDATE Response: ", res.data);
        setNotes(prev =>
          prev.map(note =>
            note._id === noteId ? res.data.note : note))
      })
  }





  return (
    <div className='container'>
      <h1 className='heading'>Notes App</h1>

      <form onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Enter title :" />
        <input name="description" type="text" placeholder="Enter desc :" />
        <button className='btn'>Create note</button>
      </form>

      <div className="notes">{/* ✅ ONE GRID */}

        {notes.map((note, index) => (
          <div className="content" key={note._id}>

            <div className='note_id'>
              <p>{index + 1}.</p>
            </div>

            <div className="note">

              {editId === note._id ? (
                <>
                {/* UPDATE - Inputs */}
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

                    {/* SAVE & CANCEL */}
                 <div className="btns">
                   <button className='btn save-btn'
                    onClick={() => {
                      handleUpdateOnId(note._id, editData);
                      setEditId(null);
                    }}
                  >
                    Save
                  </button>

                  <button className='btn cancel-btn' onClick={() => setEditId(null)}>
                    Cancel
                  </button>
                 </div>
                </>
              ) : (
                <>
                  <h2>Title : {note.title}</h2>
                  <p>Description : {note.description}</p>

                  <div className="btns">
                    <button
                      className='btn edit-btn'
                      onClick={() => {
                        setEditId(note._id);
                        setEditData({
                          title: note.title,
                          description: note.description
                        });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className='btn delete-btn'
                      onClick={() => handleOnDelete(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        ))}


      </div>
    </div>
  )
}

export default App