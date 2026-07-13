// ==========================
// ELEMENTS
// ==========================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const completedBtn = document.getElementById("completed-btn");

// ==========================
// STATE
// ==========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// ==========================
// SAVE TO LOCAL STORAGE
// ==========================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==========================
// DISPLAY TASKS
// ==========================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        li.dataset.id = task.id;

        li.innerHTML = `

            <span class="task-text ${task.completed ? "completed" : ""}">
                ${task.text}
            </span>

            <div class="task-actions">

                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>

        `;

        taskList.appendChild(li);

    });

}

// ==========================
// CREATE TASK
// ==========================

taskForm.addEventListener("submit", function(e){

    e.preventDefault();

    const text = taskInput.value.trim();

    if(text === "")
        return;

    tasks.push({

        id: Date.now(),

        text: text,

        completed: false

    });

    saveTasks();

    renderTasks();

    taskInput.value = "";

});

// ==========================
// EVENT DELEGATION
// ==========================

taskList.addEventListener("click", function(e){

    const li = e.target.closest(".task-item");

    if(!li)
        return;

    const id = Number(li.dataset.id);

    // DELETE

    if(e.target.classList.contains("delete-btn")){

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();

        renderTasks();

    }

    // COMPLETE

    if(e.target.classList.contains("complete-btn")){

        tasks.forEach(task => {

            if(task.id === id){

                task.completed = !task.completed;

            }

        });

        saveTasks();

        renderTasks();

    }

    // EDIT

    if(e.target.classList.contains("edit-btn")){

        const task = tasks.find(task => task.id === id);

        const updated = prompt("Edit Task", task.text);

        if(updated !== null && updated.trim() !== ""){

            task.text = updated.trim();

            saveTasks();

            renderTasks();

        }

    }

});

// ==========================
// FILTER BUTTONS
// ==========================

allBtn.addEventListener("click", function(){

    currentFilter = "all";

    renderTasks();

});

activeBtn.addEventListener("click", function(){

    currentFilter = "active";

    renderTasks();

});

completedBtn.addEventListener("click", function(){

    currentFilter = "completed";

    renderTasks();

});

// ==========================
// INITIAL LOAD
// ==========================

renderTasks();