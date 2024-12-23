// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Global variable for saved theme
let savedTheme = localStorage.getItem('savedTheme') || 'standard';

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', handleTaskAction);
document.addEventListener("DOMContentLoaded", () => {
    applyTheme(savedTheme);
    fetchTasks();
});
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Fetch tasks from API and render them
async function fetchTasks() {
    try {
        console.log("Fetching tasks...");
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');

        const tasks = await response.json();
        console.log("Tasks fetched:", tasks); // Debugging: Confirm fetched tasks
        renderTasks(tasks); // Render tasks in UI
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
    }
}

function renderTasks(tasks) {
    toDoList.innerHTML = ''; // Clear the task list
    tasks.forEach(task => renderTask(task)); // Render each task
}

function renderTask(task) {
    console.log("Rendering task:", task); // Debugging: Task to render
    // Existing task rendering logic...
}



// Render all task
function renderTasks(tasks) {
    toDoList.innerHTML = ''; // Clear the task list
    tasks.forEach(task => renderTask(task)); // Render each task using renderTask
}

// Render a single task
function renderTask(task) {
    const toDoDiv = document.createElement('div');
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);
    if (task.completed) toDoDiv.classList.add('completed');
    toDoDiv.setAttribute('data-id', task.id || task._id);

    // Task title
    const newToDo = document.createElement('li');
    newToDo.textContent = task.title || 'Untitled Task';
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    // "Complete" button
    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    // "Delete" button
    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    // Append the task div to the list
    toDoList.appendChild(toDoDiv);

    console.log("Rendered task:", task); // Debugging: Check if each task is rendered
}


// Add a new task and send it to the API
async function addToDo(event) {
    event.preventDefault();

    const taskTitle = toDoInput.value.trim();
    if (!taskTitle) {
        alert('You must write something!');
        return;
    }

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: taskTitle })
        });

        if (!response.ok) throw new Error('Failed to create task');

        const newTask = await response.json();
        renderTask(newTask); // Use renderTask to render the new task
        toDoInput.value = ''; // Clear the input field
    } catch (error) {
        console.error('Error adding task:', error);
    }
}


// Handle task actions (delete or complete)
async function handleTaskAction(event) {
    const item = event.target.closest('button'); // Ensure the button itself is targeted
    if (!item) return;

    const taskId = item.parentElement.getAttribute('data-id'); // Parent is the task div
    if (!taskId) {
        console.error('No task ID found for the clicked button.');
        return;
    }

    if (item.classList.contains('delete-btn')) {
        // Delete action
        try {
            const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete task');
            item.parentElement.remove(); // Remove task from DOM
            console.log(`Deleted task with ID: ${taskId}`); // Debugging
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    } else if (item.classList.contains('check-btn')) {
        // Toggle completion action
        const task = item.parentElement;
        const isCompleted = !task.classList.contains('completed');
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: isCompleted }),
            });
            if (!response.ok) throw new Error('Failed to update task');
            task.classList.toggle('completed'); // Update UI state
            console.log(`Toggled completion for task with ID: ${taskId}`); // Debugging
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }
}



// Change theme function
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = color;
    applyTheme(color);
}

// Apply the selected theme
function applyTheme(color) {
    document.body.className = color;
    document.querySelector('input').className = `${color}-input`;
    document.querySelectorAll('.todo').forEach(todo => {
        todo.className = `todo ${color}-todo` + (todo.classList.contains('completed') ? ' completed' : '');
    });
    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn')) {
            button.className = `check-btn ${color}-button`;
        } else if (button.classList.contains('delete-btn')) {
            button.className = `delete-btn ${color}-button`;
        } else if (button.classList.contains('todo-btn')) {
            button.className = `todo-btn ${color}-button`;
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    savedTheme = localStorage.getItem('savedTheme') || 'standard';
    applyTheme(savedTheme);
    fetchTasks(); // Fetch tasks from the API and render them
});
