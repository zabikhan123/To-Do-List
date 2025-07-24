document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.querySelector('.todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const itemsLeft = document.getElementById('items-left');
    const clearCompleted = document.getElementById('clear-completed');
    const themeToggle = document.querySelector('.theme-toggle');
});
    // Load todos from localStorage

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    let isDarkTheme = false;

    // Function to save todos to localStorage

    renderTodos();
    updateItemsLeft();
    setupDragAndDrop();

        // added event listeners

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

        // filter todos based on the selected filter

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });
       // update the count of items left

        clearCompleted.addEventListener('click', clearCompletedTodos);
    themeToggle.addEventListener('click', toggleTheme);


        // added new todo function

        function addTodo() {
        const text = todoInput.value.trim();
        if (!text) return;

        const newTodo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date()
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
        todoInput.focus();
    }
    // Function to save todos to localStorage

        function toggleComplete(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
        updateItemsLeft();
    } 

        // function to delete a todo

        function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
        updateItemsLeft();
    }
        // clear completed todos

        function clearCompletedTodos() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
        // update the items left

        function updateItemsLeft() {
        const count = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = `${count} ${count === 1 ? 'item' : 'items'} left`;
    }

      // show or hide the workspace based on the theme
      
        function renderTodos() {
        todoList.innerHTML = '';

        let filteredTodos = [...todos];
        
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        if (filteredTodos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = currentFilter === 'all' 
                ? 'No tasks yet!' 
                : currentFilter === 'active' 
                    ? 'No active tasks!' 
                    : 'No completed tasks!';
            todoList.appendChild(emptyState);
            return;
        }

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.dataset.id = todo.id;
            todoItem.draggable = true;
            
            todoItem.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onclick="app.toggleComplete(${todo.id})"
                >
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            todoList.appendChild(todoItem);
        });
    }