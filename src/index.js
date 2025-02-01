import "./styles.css"
const projectsContainer = document.querySelector('[data-projects]')
const newProjectForm = document.querySelector('data-new-project-form')
const newProjectInput = document.querySelector('data-new-project-input')


let projects = [{
    name:'diss drake', 
    id:1
    }, {
    name:'release Gnx', 
    id:2
    }, {
    name:'perform at superbowl', 
    id:3
    }]

function render() {
    clearElement(projectsContainer)
    projects.forEach(project => {
        const projectElement = document.createElement('li')
        projectElement.dataset.projectId = project.id
        projectElement.classList.add('list-name')
        projectElement.textContent = project.name
        projectsContainer.appendChild(projectElement)
    })
}
    

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }

}

render()
