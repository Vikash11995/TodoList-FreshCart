
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Save tasks to localStorage as an array of objects
function storeTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.childNodes[0].nodeValue,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = ""
}

// Load tasks from localStorage and render them
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach(task => addTask(task.text, task.completed));
}

// Add tasks from textarea (one per line)
function addTasksFromInput() {
    const lines = taskInput.value.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    lines.forEach(line => addTask(line));
    taskInput.value = '';
    storeTasks();
}

// Add a single task to the list
function addTask(taskText, completed = false) {
    const li = document.createElement('li');
    li.textContent = taskText;

    if (completed) {
        li.classList.add('completed');
    }

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `<span id="delBtn"><img src="cross.png" alt=""></span>`;
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        li.remove();
        storeTasks();
    });

    // Toggle completed on click
    li.addEventListener('click', function(e) {
        if (e.target !== deleteBtn) {
            li.classList.toggle('completed');
            storeTasks();
        }
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    storeTasks();
}

// Add tasks on button click
addBtn.addEventListener('click', addTasksFromInput);

// Add tasks on pressing Enter (without Shift)
taskInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addTasksFromInput();
    }
});

// Handle paste: split pasted text by lines and add as separate tasks
taskInput.addEventListener('paste', function(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length > 1) {
        // Add all lines as tasks immediately
        lines.forEach(line => addTask(line));
        taskInput.value = '';
        storeTasks();
    } else {
        // Default paste for single line
        document.execCommand('insertText', false, text);
    }
});

// Store tasks on every input in the task input field
taskInput.addEventListener('input', function() {
    // This only stores the input field value, not the task list
    // If you want to store the input as a draft, you can do so here
    localStorage.setItem('taskInputDraft', taskInput.value);
});

// Restore draft input if available
window.addEventListener('DOMContentLoaded', function() {
    const draft = localStorage.getItem('taskInputDraft');
    if (draft) {
        taskInput.value = draft;
    }
    loadTasks();
});