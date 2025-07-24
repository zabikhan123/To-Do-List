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