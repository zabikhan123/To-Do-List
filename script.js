
document.addEventListener('DOMContentLoaded', () => {
    
    const elements = {
        input: document.getElementById('todo-input'),
        addBtn: document.getElementById('add-btn'),
        list: document.querySelector('.todo-list'),
        filters: document.querySelectorAll('.filter-btn'),
        counter: document.getElementById('items-left'),
        clearBtn: document.getElementById('clear-completed'),
        themeBtn: document.querySelector('.theme-toggle')
    };

    const state = {
        todos: JSON.parse(localStorage.getItem('todos')) || [],
        filter: 'all',
        darkMode: false
    };

    function init() {
        renderTodos();
        updateCounter();
        setupDragDrop();
        loadTheme();
    }

    function addTodo() {
        const text = elements.input.value.trim();
        if (!text) return;

        const newTodo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date()
        };

        state.todos.push(newTodo);
        saveAndUpdate();
        elements.input.value = '';
        elements.input.focus();
    }

    function toggleComplete(id) {
        state.todos = state.todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        );
        saveAndUpdate();
    }

    function deleteTodo(id) {
        state.todos = state.todos.filter(todo => todo.id !== id);
        saveAndUpdate();
    }

    function clearCompleted() {
        state.todos = state.todos.filter(todo => !todo.completed);
        saveAndUpdate();
    }

    function saveAndUpdate() {
        saveToLocalStorage();
        renderTodos();
        updateCounter();
    }

    function saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(state.todos));
    }

    function renderTodos() {
        elements.list.innerHTML = '';
        const filtered = state.todos.filter(todo => {
            if (state.filter === 'active') return !todo.completed;
            if (state.filter === 'completed') return todo.completed;
            return true;
        });
        if (filtered.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-msg';
            emptyMsg.textContent = getEmptyMessage();
            elements.list.appendChild(emptyMsg);
            return;
        }

        filtered.forEach(todo => {
            const item = document.createElement('div');
            item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            item.dataset.id = todo.id;
            item.draggable = true;
            
            item.innerHTML = `
                <input type="checkbox" 
                 class="todo-checkbox" 
                  ${todo.completed ? 'checked' : ''}
                  onchange="app.toggleComplete(${todo.id})">
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            elements.list.appendChild(item);
        });
    }
    function getEmptyMessage() {
        return {
            'all': '',
            'active':'ongoing tasks',
            'completed': 'completed tasks',
        }[state.filter];
    }
    function updateCounter() {
        const count = state.todos.filter(t => !t.completed).length;
        elements.counter.textContent = `${count} uncompleted work`;
    }
    function toggleTheme() {
        state.darkMode = !state.darkMode;
        document.documentElement.setAttribute('data-theme', 
            state.darkMode ? 'dark' : 'light');
        elements.themeBtn.innerHTML = state.darkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        state.darkMode = savedTheme === 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        elements.themeBtn.innerHTML = state.darkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }


    elements.addBtn.addEventListener('click', addTodo);
    
    elements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    elements.filters.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filter = btn.dataset.filter;
            renderTodos();
        });
    });

    elements.clearBtn.addEventListener('click', clearCompleted);

    elements.themeBtn.addEventListener('click', toggleTheme);
    function setupDragDrop() {
        let draggedItem = null;

        elements.list.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('todo-item')) {
                draggedItem = e.target;
                setTimeout(() => e.target.classList.add('dragging'), 0);
            }
        });

        elements.list.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('todo-item')) {
                e.target.classList.remove('dragging');
            }
        });

        elements.list.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(e.clientY);
            const currentItem = document.querySelector('.dragging');
            
            if (currentItem) {
                elements.list.insertBefore(
                    currentItem, 
                    afterElement || null
                );
            }
        });

        function getDragAfterElement(y) {
            const items = [...document.querySelectorAll('.todo-item:not(.dragging)')];
            
            return items.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                
                return offset < 0 && offset > closest.offset 
                    ? { offset, element: child } 
                    : closest;
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }

    window.app = {
        toggleComplete,
        deleteTodo
    };

    init();
});