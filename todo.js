const taskInput = document.querySelector("#task")
const addTaskButton = document.querySelector("#addTask")
const taskList = document.querySelector("#list")
const pendingTasks = document.querySelector("#pending")
const completedTasks = document.querySelector("#completed")
const totalTasks = document.querySelector("#total")

const STORAGE_KEY = "todoApp.tasks.v1";

let tasks = loadTasks() 

renderAllTasks()

addTaskButton.addEventListener("click",addTask)
taskInput.addEventListener("keypress",(event)=>{
    if(event.key == "Enter") addTask()
})

//que hago despues de tener las tareas de memoria?
function renderAllTasks(){
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const li = renderTask(task);
        taskList.appendChild(li);
    });
    updateCounters();
}
    
function renderTask(task){
    const li = document.createElement("li");

    const chk = document.createElement("input")
    chk.setAttribute("type","checkbox")    

    const p = document.createElement("p")    

    const deleteButton = document.createElement("button")
    deleteButton.textContent= "Eliminar"        

    li.appendChild(chk)
    li.appendChild(p)
    li.appendChild(deleteButton)
    
    p.textContent = task.task
    p.style.margin = 0;
    task.completed? p.classList.add("completed"):p.classList.remove("completed")

    li.style.display = "flex"
    li.style.alignItems= "center"
    li.style.gap = "8px";


    chk.checked = task.completed
    
    taskList.appendChild(li)

    chk.addEventListener("change",()=>{
        task.completed = chk.checked
        task.completed? p.classList.add("completed"):p.classList.remove("completed")
        saveTasks()
        updateCounters()
    })

    deleteButton.addEventListener("click",()=>{
        tasks = tasks.filter(t => t.id !== task.id)
        saveTasks()
        li.remove()
        updateCounters()
    })

    return li
}



function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Formato inválido, limpiando key:", err);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("No se pudo guardar en localStorage:", err);
  }
}



function addTask(){ 
    if (taskInput.value == "") return
    
    const newTask = {
        id: crypto.randomUUID(),
        task: taskInput.value.trim(),
        completed: false,
    }
    
    tasks.push(newTask)
    renderTask(newTask)
    saveTasks()         

    taskInput.value = ""
    updateCounters();
}

function updateCounters() {
    const tasks = taskList.querySelectorAll("li");
    const completed = taskList.querySelectorAll("input[type='checkbox']:checked").length;
    const pending = tasks.length - completed;

    totalTasks.textContent = tasks.length;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;
}

