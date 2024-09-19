import './App.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:3001/tasks');
        setTasks(response.data);
    };

    const addTask = async (e) => {
        e.preventDefault();
        console.log(description);
        if (!title) {
            setError('Title is required');
            return;
        }
        if (!description) {
            setError('Description is required');
            return;
        }
        try {
            const postData = await axios.post('http://localhost:3001/tasks', { title, description });
            setTitle('');
            setDescription('');
            setError('');
            fetchTasks();
            console.log(postData.data.message);
            if(postData){

                setSuccessMessage(postData.data.message);
            }
            
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    const deleteTask = async (id) => {
        const deleteData = await axios.delete(`http://localhost:3001/tasks/${id}`);
        console.log(deleteData);
        setSuccessMessage(deleteData.data.message);
        fetchTasks();
    };

    return (
        <div className="main-content">
            <div className="container p-4">
                <h1 className="text-2xl font-bold mb-4">Task Management</h1>
                <div className="form-block">
                    <div className="side-form">
                        <form onSubmit={addTask} className="task-form mb-4">
                            <h3>Add task form</h3>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border p-2 mr-2"
                                placeholder="Enter Title"
                            />
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border p-2 mr-2"
                                placeholder="Enter Description"
                            />
                            <button type="submit" className="bg-blue-500 text-white p-2">Add Task</button>
                            {error && <p className="text-red-500">{error}</p>}
                           
                        </form>
                    </div>
                    <div className="list-content">
                    {successMessage && <p className="text-green">{successMessage}</p>}
                        <div className="card-list">
                            {tasks.map((task) => (
                                <div key={task.id} className="card">
                                    <div className="card-inner">
                                    <h4>{task.title}</h4>
                                    <p>{task.description}</p>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="bg-red-500 text-white p-1"
                                    >
                                        Delete
                                    </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default App;
