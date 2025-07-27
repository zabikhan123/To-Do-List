document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("todo-input"),
        addBtn = document.getElementById("add-btn"),
        list = document.querySelector(".todo-list"),
        counter = document.getElementById("items-left"),
        clearBtn = document.getElementById("clear-completed"),
        filters = document.querySelectorAll(".filter-btn");

  let todos = JSON.parse(localStorage.getItem("todos")) || [], filter = "all";

  const save = () => localStorage.setItem("todos", JSON.stringify(todos));
  const render = () => {
    list.innerHTML = "";
    todos.filter(t => filter === "all" || (filter === "active") !== t.done)
         .forEach((t, i) => {
      list.innerHTML += `
        <div class="todo-item ${t.done ? 'completed' : ''}">
          <input type="checkbox" class="todo-checkbox" ${t.done ? 'checked' : ''} onchange="toggle(${i})">
          <span class="todo-text">${t.text}</span>
          <button class="delete-btn" onclick="remove(${i})"><i class="fas fa-trash"></i></button>
        </div>`;
    });
    counter.textContent = `${todos.filter(t => !t.done).length} items left`;
    save();
  };

  window.toggle = i => { todos[i].done = !todos[i].done; render(); };
  window.remove = i => { todos.splice(i, 1); render(); };

  addBtn.onclick = () => {
    if (input.value.trim()) todos.push({ text: input.value.trim(), done: false });
    input.value = ""; render();
  };



  input.addEventListener("keypress", e => e.key === "Enter" && addBtn.click());

  clearBtn.onclick = () => { todos = todos.filter(t => !t.done);
    
    render(); };

  filters.forEach(btn => {
    btn.onclick = () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filter = btn.dataset.filter;
      render();
    };
  });
  
  render();
});
