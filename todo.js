document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const completedCountSpan = document.getElementById('completed-count');
    const uncompletedCountSpan = document.getElementById('uncompleted-count');

    // Initial load of tasks from the HTML structure (for demonstration)
    updateCounts(); 

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);
    taskList.addEventListener('change', updateCounts);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const li = document.createElement('li');
        li.classList.add('task-item');
        li.innerHTML = `
            <input type="checkbox">
            <span class="task-text">${taskText}</span>
            <div class="actions">
                <button class="delete-btn">Delete</button>
                <button class="edit-btn">Edit</button>
            </div>
        `;
        taskList.appendChild(li);
        taskInput.value = '';
        updateCounts();
    }

    function handleTaskActions(e) {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        if (target.classList.contains('delete-btn')) {
            taskItem.remove();
            updateCounts();
        } else if (target.classList.contains('edit-btn')) {
            editTask(taskItem);
        } else if (target.type === 'checkbox') {
            toggleTaskCompletion(taskItem, target.checked);
        }
    }

    function toggleTaskCompletion(taskItem, isChecked) {
        if (isChecked) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }
    }

    function editTask(taskItem) {
        const taskTextSpan = taskItem.querySelector('.task-text');
        const currentText = taskTextSpan.textContent;
        const editBtn = taskItem.querySelector('.edit-btn');

        if (editBtn.textContent === 'Edit') {
            // Switch to edit mode
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.classList.add('edit-input');

            taskItem.replaceChild(input, taskTextSpan);
            editBtn.textContent = 'Save';
            input.focus();
            
            // Allow saving on 'Enter' key press
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveTask(taskItem, input, editBtn);
                }
            });

        } else {
            // Switch to save mode
            const input = taskItem.querySelector('.edit-input');
            saveTask(taskItem, input, editBtn);
        }
    }
    
    function saveTask(taskItem, inputElement, editBtn) {
        const newText = inputElement.value.trim();
        if (newText) {
            const span = document.createElement('span');
            span.classList.add('task-text');
            span.textContent = newText;
            taskItem.replaceChild(span, inputElement);
            editBtn.textContent = 'Edit';
        } else {
            // Revert if empty
            alert('Task cannot be empty.');
            inputElement.focus();
        }
    }

    function updateCounts() {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.task-item input[type="checkbox"]:checked').length;
        const uncompletedTasks = totalTasks - completedTasks;

        completedCountSpan.textContent = completedTasks;
        uncompletedCountSpan.textContent = uncompletedTasks;

        // Apply completion class based on the checkbox state (important for initial load and direct checkbox clicks)
        Array.from(taskList.children).forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            toggleTaskCompletion(item, checkbox.checked);
        });
    }

    // Call updateCounts on load to ensure the footer reflects the initial HTML state
    updateCounts(); 
});
