import "./styles.css"
const projectsContainer = document.querySelector('[data-projects]')
const newProjectForm = document.querySelector('[data-new-project-form]')
const newProjectInput = document.querySelector('[data-new-project-input]')
const LOCAL_STORAGE_PROJECT_KEY = 'task.project'
const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = 'task.selectedProjectId'
const deleteProjectButton = document.querySelector('[data-delete-project-button]')
const projectDisplayContainer = document.querySelector('[data-project-display-container]')
const projectTitle = document.querySelector('[data-project-title]')
const projectCount = document.querySelector('[data-project-count]')
const taskContainer = document.querySelector('[data-tasks]') 
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksBtn = document.querySelector('[data-clear-complete-tasks-button]')

let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || []
let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY)



deleteProjectButton.addEventListener('click', e => {
    projects = projects.filter(project => project.id !== selectedProjectId)
    selectedProjectId = null
    saveAndRender()
})

clearCompleteTasksBtn.addEventListener('click', e => {
    const selectedProject = projects.find(project => project.id === selectedProjectId)
    selectedProject.tasks = selectedProject.tasks.filter(task => !task.complete)
    saveAndRender()

})


projectsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedProjectId = e.target.dataset.projectId
        saveAndRender()
    }
})

taskContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedProject = projects.find(project => project.id === selectedProjectId)
        const selectedTask = selectedProject.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedProject)
    }
})

newProjectForm.addEventListener('submit', e => {
    e.preventDefault()
    const projectName = newProjectInput.value
    if (projectName == null || projectName === '') return
    const project = createProject(projectName)
    newProjectInput.value = null
    projects.push(project)
    saveAndRender()

})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === "") return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedProject = projects.find(project => project.id === selectedProjectId)
    selectedProject.tasks.push(task)
    saveAndRender()

})

function save() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY, selectedProjectId)
}

function saveAndRender () {
    save()
    render()
}

function createProject(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }

} 

function render() {
    clearElement(projectsContainer)
    renderProjects()

    const selectedProject = projects.find(project => project.id === selectedProjectId)
    if (selectedProjectId === null) {
        projectDisplayContainer.style.display = 'none'
    } else {
        projectDisplayContainer.style.display = ""
        projectTitle.textContent = selectedProject.name
        renderTaskCount(selectedProject)
        clearElement(taskContainer)
        renderTasks(selectedProject)
    }
}


function renderTasks(selectedProject) {
    selectedProject.tasks.forEach(task => {
        const taskEl = document.importNode(taskTemplate.content, true)
        const checkbox = taskEl.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskEl.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        taskContainer.appendChild(taskEl)

    })

}

function renderTaskCount(selectedProject) {
    const incompleteTasksCount = selectedProject.tasks.filter(task => !task.complete).length
    const taskString = incompleteTasksCount === 1 ? "task" : "tasks"
    projectCount.textContent = `${incompleteTasksCount} ${taskString} remaining`
}

function renderProjects() {
    projects.forEach(project => {
        const projectElement = document.createElement('li')
        projectElement.dataset.projectId = project.id
        projectElement.classList.add('list-name')
        projectElement.textContent = project.name
        if (project.id === selectedProjectId) {
            projectElement.classList.add('active-list')
        }
        projectsContainer.appendChild(projectElement)
    })

}
    

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()