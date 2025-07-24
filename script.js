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