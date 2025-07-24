// 📌 1. تنظیمات اولیه - وقتی صفحه کاملاً بارگذاری شد
document.addEventListener('DOMContentLoaded', () => {
    
    // 🔍 2. انتخاب عناصر مهم از صفحه
    const elements = {
        input: document.getElementById('todo-input'),
        addBtn: document.getElementById('add-btn'),
        list: document.querySelector('.todo-list'),
        filters: document.querySelectorAll('.filter-btn'),
        counter: document.getElementById('items-left'),
        clearBtn: document.getElementById('clear-completed'),
        themeBtn: document.querySelector('.theme-toggle')
    };

    // 💾 3. وضعیت برنامه
    const state = {
        todos: JSON.parse(localStorage.getItem('todos')) || [],
        filter: 'all',
        darkMode: false
    };

    // 🚀 4. راه‌اندازی اولیه برنامه
    function init() {
        renderTodos();
        updateCounter();
        setupDragDrop();
        loadTheme();
    }

    // ✨ 5. توابع اصلی برنامه

    // افزودن کار جدید
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

    // تغییر وضعیت انجام کار
    function toggleComplete(id) {
        state.todos = state.todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        );
        saveAndUpdate();
    }

    // حذف کار
    function deleteTodo(id) {
        state.todos = state.todos.filter(todo => todo.id !== id);
        saveAndUpdate();
    }

    // پاک کردن کارهای انجام شده
    function clearCompleted() {
        state.todos = state.todos.filter(todo => !todo.completed);
        saveAndUpdate();
    }

    // 🔄 6. توابع کمکی

    // ذخیره و به‌روزرسانی
    function saveAndUpdate() {
        saveToLocalStorage();
        renderTodos();
        updateCounter();
    }

    // ذخیره در localStorage
    function saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(state.todos));
    }

    // نمایش کارها
    function renderTodos() {
        elements.list.innerHTML = '';

        // فیلتر کردن بر اساس وضعیت
        const filtered = state.todos.filter(todo => {
            if (state.filter === 'active') return !todo.completed;
            if (state.filter === 'completed') return todo.completed;
            return true;
        });

        // اگر لیست خالی است
        if (filtered.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-msg';
            emptyMsg.textContent = getEmptyMessage();
            elements.list.appendChild(emptyMsg);
            return;
        }

        // ایجاد عناصر کارها
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

    // پیام لیست خالی
    function getEmptyMessage() {
        return {
            'all': '',
            'active':'ongoing tasks',
            'completed': 'completed tasks',
        }[state.filter];
    }

    // به‌روزرسانی شمارنده
    function updateCounter() {
        const count = state.todos.filter(t => !t.completed).length;
        elements.counter.textContent = `${count} کار باقیمانده`;
    }

    // تغییر تم
    function toggleTheme() {
        state.darkMode = !state.darkMode;
        document.documentElement.setAttribute('data-theme', 
            state.darkMode ? 'dark' : 'light');
        elements.themeBtn.innerHTML = state.darkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
    }

    // بارگذاری تم از حافظه
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        state.darkMode = savedTheme === 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        elements.themeBtn.innerHTML = state.darkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }

    // 🖱️ 7. مدیریت رویدادها

    // رویداد کلیک برای افزودن کار
    elements.addBtn.addEventListener('click', addTodo);
    
    // رویداد کیبورد برای افزودن کار
    elements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // رویدادهای فیلترها
    elements.filters.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filter = btn.dataset.filter;
            renderTodos();
        });
    });

    // رویداد پاک کردن کارهای انجام شده
    elements.clearBtn.addEventListener('click', clearCompleted);

    // رویداد تغییر تم
    elements.themeBtn.addEventListener('click', toggleTheme);

    // 🧩 8. قابلیت کشیدن و رها کردن
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

    // 🌐 9. در دسترس قرار دادن توابع برای HTML
    window.app = {
        toggleComplete,
        deleteTodo
    };

    // 🏁 10. شروع برنامه
    init();
});