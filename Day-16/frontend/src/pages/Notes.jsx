import { useEffect, useState, useContext,} from "react";
import API from "../services/axios";
import { useNavigate,} from "react-router-dom";
import { AuthContext,} from "../context/AuthContext";

function Notes() {

  const navigate = useNavigate();

  const { setToken } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
    });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] =
    useState({
      title: "",
      description: "",
    });


  // ================= FETCH NOTES =================

  async function fetchNotes() {
    try {
      setLoading(true);
      const res = await API.get("/notes");
      setNotes(res.data.notes);
    } catch (error) {
      console.error(error);
      setError( error.response?.data?.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);


  // ================= CREATE NOTE =================
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setCreating(true);
      const res = await API.post("/notes", formData );

      setNotes((prev) => [ res.data.note, ...prev ]);

      setFormData({ title: "", description: ""});
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to create note");
    } finally {
      setCreating(false);
    }
  }


  // ================= DELETE NOTE =================
  async function handleDelete(id) {
    try {
      setDeletingId(id);
      await API.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to delete note");
    } finally {
      setDeletingId(null);
    }
  }

  // ================= UPDATE NOTE =================
  async function handleUpdate(id) {
    try {
      setUpdating(true);
      const res = await API.patch(`/notes/${id}`, editData);
      setNotes((prev) => prev.map((note) => note._id === id
        ? res.data.note
        : note
      )
    );
    setEditId(null);
    setEditData({title: "",description: ""});
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to update note");
    } finally {
      setUpdating(false);
    }
  }


  // ================= LOGOUT =================

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (

    <div className="min-h-screen bg-[#f4f7fb] p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-blue-600">Notes App</h1>
          <p className="text-gray-500 mt-2">Manage your notes professionally</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Logout
        </button>

      </div>


      {/* CREATE NOTE */}

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-10">

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Enter title"
            value={formData.title}
            disabled={creating}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
          />

          <input
            type="text"
            placeholder="Enter description"
            value={formData.description}
            disabled={creating}
            onChange={(e) =>
              setFormData({
                ...formData,
                description:
                  e.target.value,
              })
            }
            className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
          />

          <button
            disabled={creating}
            className={`rounded-xl font-semibold transition text-white flex items-center justify-center gap-2
            ${creating
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >

            {creating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              "Create Note"
            )}

          </button>

        </form>

      </div>


      {/* ERROR */}

      {error && (

        <div className="max-w-6xl mx-auto mb-6">

          <p className="bg-red-100 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </p>

        </div>

      )}


      {/* NOTES GRID */}

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading ? (

          <div className="col-span-full flex justify-center">

            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : notes.length === 0 ? (

          <div className="col-span-full text-center text-gray-500 text-lg">
            No notes found
          </div>

        ) : (

          notes.map((note) => (
            <div key={note._id} className="bg-white rounded-2xl shadow-lg p-5">
              {editId === note._id ? (
                <>
                  <input
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({...editData, title: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mb-3"/>

                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({...editData, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mb-3"/>

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        handleUpdate(note._id)
                      }
                      disabled={updating}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >

                      {updating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}

                    </button>

                    <button
                      onClick={() =>
                        setEditId(null)
                      }
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>

                  </div>

                </>

              ) : (

                <>

                  <h2 className="text-2xl font-bold text-gray-800">
                    {note.title}
                  </h2>

                  <p className="text-gray-600 mt-3">
                    {note.description}
                  </p>

                  <p className="text-xs text-gray-400 mt-4">
                    {
                      new Date(
                        note.createdAt
                      ).toLocaleString()
                    }
                  </p>

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() => {

                        setEditId(
                          note._id
                        );

                        setEditData({
                          title:
                            note.title,

                          description:
                            note.description,
                        });

                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(note._id)
                      }
                      disabled={
                        deletingId === note._id
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >

                      {deletingId === note._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}

                    </button>

                  </div>

                </>

              )}

            </div>

          ))

        )}

      </div>

    </div>

  );
}

export default Notes;