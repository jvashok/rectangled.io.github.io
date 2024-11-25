document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskModal = document.getElementById('taskModal');
    const taskForm = document.getElementById('taskForm');
    const tasksContainer = document.getElementById('tasksContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryItems = document.querySelectorAll('.category-item');

    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        taskModal.classList.add('active');
    });

    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal || e.target.classList.contains('close-modal')) {
            taskModal.classList.remove('active');
        }
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const category = document.getElementById('taskCategory').value;
        const time = document.getElementById('taskTime').value;

        const newTask = {
            id: Date.now(),
            title,
            category,
            time,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
        taskForm.reset();
        taskModal.classList.remove('active');
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterTasks(currentFilter, searchTerm);
    });

    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.textContent.trim().toLowerCase();
            currentFilter = category;
            filterTasks(category, searchInput.value.toLowerCase());
            
            // Update active state
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Functions
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(tasksToRender = tasks) {
        tasksContainer.innerHTML = '';
        
        tasksToRender.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksContainer.appendChild(taskElement);
        });
    }

    function createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-card';
        taskDiv.innerHTML = `
            <div class="task-content">
                <span class="category-dot ${task.category}"></span>
                <span class="task-title">${task.title}</span>
            </div>
            <span class="time">${task.time}</span>
        `;

        // Add completion toggle
        taskDiv.addEventListener('click', () => {
            task.completed = !task.completed;
            taskDiv.classList.toggle('completed');
            saveTasks();
        });

        if (task.completed) {
            taskDiv.classList.add('completed');
        }

        return taskDiv;
    }

    function filterTasks(category, searchTerm = '') {
        let filteredTasks = tasks;
        
        if (category !== 'all') {
            filteredTasks = tasks.filter(task => task.category === category);
        }

        if (searchTerm) {
            filteredTasks = filteredTasks.filter(task => 
                task.title.toLowerCase().includes(searchTerm)
            );
        }

        renderTasks(filteredTasks);
    }

    // Initial render
    renderTasks();
});