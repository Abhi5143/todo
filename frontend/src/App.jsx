import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  // ADD TODO
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos((prev) => [...prev, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // FETCH TODOS
  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // START EDITING
  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  // SAVE EDITED TODO
  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText,
      });

      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? response.data : todo))
      );

      setEditingTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // DELETE TODO
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // TOGGLE COMPLETED
  const toggleTodo = async (id) => {
    try {
      const current = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !current.completed,
      });

      setTodos((prev) =>
        prev.map((t) => (t._id === id ? response.data : t))
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Task Manager
        </h1>

        {/* ADD FORM */}
        <form                                     // ****** We can change the placeholder text or the button text 
          onSubmit={addTodo}
          className="flex items-center gap-2 shadow-sm border border-gray-200 p-2 rounded-lg"
        >
          <input
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
          >
            Add Task
          </button>
        </form>

        {/* TODO LIST */}
        <div className="mt-4">
          {todos.length === 0 ? (
            <div className="text-gray-400 text-center mt-6">No tasks yet</div>
          ) : (
            <div className="flex flex-col gap-4">
              {todos.map((todo) => (
                <div key={todo._id}>
                  {editingTodo === todo._id ? (
                    // EDIT MODE
                    <div className="flex items-center gap-x-3">
                      <input                                                  // ***** To Change the style of the editing input here
                        className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />

                      <div className="flex gap-x-2">
                        <button                                             // ********* To Modify the save button style or icon
                          onClick={() => saveEdit(todo._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                        >
                          <MdOutlineDone />
                        </button>

                        <button                                               // ******** To Modify the cancel button style or icon
                          onClick={() => setEditingTodo(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer"
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // NORMAL VIEW
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-4 overflow-hidden">
                        <button                                                       //****** To Change how completed tasks look (colors, style)
                          onClick={() => toggleTodo(todo._id)}
                          className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${
                            todo.completed
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {todo.completed && <MdOutlineDone />}
                        </button>

                        <span                                             //*********** To Change the style of the task text
                        className="text-gray-800 truncate font-medium">
                          {todo.text}
                        </span>
                      </div>

                      <div className="flex gap-x-2">
                        <button                                       // ******** To Modify the edit button style or icon 
                          className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                          onClick={() => startEditing(todo)}
                        >
                          <MdModeEditOutline />
                        </button>

                        <button                                       // ********* To Modify the delete button style or icon
                          onClick={() => deleteTodo(todo._id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
