import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({
    title: "",
    description: ""
  })
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const API_URL = "https://backend-development-3-6ep2.onrender.com";


  function fetchData() {
      axios.get(`${API_URL}/api/notes`)
      .then(res => {
        console.log(res.data.notes);
        setNotes(res.data.notes)
      })
      .catch(err => {
        alert("data fetching is not happening");
        console.error(err);
      })
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

      axios.post(`${API_URL}/api/notes`, formData)
      .then((res) => {
        setNotes(prev => [res.data.note, ...prev])
        setFormData({ title: "", description: "" }) // reset form
      })
      .catch(err => {
        alert("post is not working");
        console.error(err);
      })
  }

  function handleOnDelete(noteId) {
    console.log(noteId);

      axios.delete(`${API_URL}/api/notes/${noteId}`)
      .then(res => {
        console.log(res.data);
        setNotes(prev => prev.filter(note => note._id !== noteId))
      })
      .catch(err => {
        alert("delete is not wroking");
        console.error(err);
      })
  }

  function handleOnUpdate(noteId, updatedNote) {
      axios.patch(`${API_URL}/api/notes/${noteId}`, updatedNote)
      .then(res => {
        console.log("Update response: " + res.data.note);
        setNotes(prev => prev.map(note =>
          note._id === noteId ? res.data.note : note
        ))
      })
  }




  return (
    <div className='container'>
      <h1 className='heading'>Notes App</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          name="title"
          type="text"
          placeholder="Enter title :"
        />

        <input
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          name="description"
          type="text"
          placeholder="Enter desc :"
        />
        <button className='btn'>Create note</button>
      </form>

      <div className="notes">{/* ✅ ONE GRID */}

        {notes.map((note, index) => {
          console.log(note);
          return (
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
                          handleOnUpdate(note._id, editData);
                          setEditId(null);
                          setEditData({
                            title: "",
                            description: ""
                          })

                        }}
                      >
                        Save
                      </button>

                      <button className='btn cancel-bt'
                        onClick={() => {
                          setEditId(null);
                          setEditData({ title: "", description: "" });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Title : {note.title}</h2>
                    <p>Description : {note.description}</p>
                    <span>
                      {note.updatedAt !== note.createdAt
                        ? `Updated: ${new Date(note.updatedAt).toLocaleString()}`
                        : note.createdAt
                          ? `Created: ${new Date(note.createdAt).toLocaleString()}`
                          : "No date available"}
                    </span>

                    <div className="btns">
                      <button
                        className='btn edit-btn'
                        onClick={() => {
                          setEditId(note._id);
                          setEditData({
                            title: note.title,
                            description: note.description
                          })
                        }}
                      >
                        Edit
                      </button>

                      <button className='btn delete-btn' onClick={() => handleOnDelete(note._id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          )

        })}


      </div>
    </div>
  )
}

export default App









// mongodb+srv://Manu:LgmJmC5FyV3u2Bzx@cluster0.8z7tuyp.mongodb.net/day-9-test