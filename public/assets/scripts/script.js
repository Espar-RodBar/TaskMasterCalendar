import { Calendar } from './Calendar.js'

const monthNameEl = document.querySelector('.month-name')
const calendarTableEl = document.querySelector('#calendar-table')
const addTaskModalEl = document.querySelector('#AddTaskDialog')
const closeDialogBtnEl = document.querySelector('#closeDialogBtn')
const taskDateEl = document.querySelector('.taskDate')
const taskDateLblEl = document.querySelector('.taskDatelbl')
const tasksListEl = document.querySelector('.list-tasks')

const prevMonthBtn = document.querySelector('.prev-month-btn > a')
const nextMonthBtn = document.querySelector('.next-month-btn  a')

const parameters = window.location.pathname.split('/')
const endpoint = parameters[1]
const year = parameters[2]
const month = Number(parameters[3]).toString()
const url = `/${endpoint}/`

let tasksState = null

// month from 1 -> 12, to 0 -> 11 scale
const calendar = new Calendar(year, month - 1)

// helpers
async function fetchTasks(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })
    const data = await response.json()
    const dataObj = JSON.parse(data.body)
    return dataObj
  } catch (err) {
    console.log('error getting tasks:', err)
    return
  }
}

async function deleteTask() {
  const id = this.dataset.taskId
  const url = '/tasks/' + id
  try {
    const response = await fetch(url, {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ data: 'id number: ' + id }),
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    location.reload()
    return
  } catch (err) {
    console.log('error deleting task:', err)
    return
  }
}

function clearFormInputs() {
  document.querySelector('#taskDurationInput').value = '2'
  document.querySelector('#taskTimeInput').value = ''
  document.querySelector('#taskNameInput').value = ''
}

function addNextMonthLink() {
  const nextMonthStr = calendar.getNextMonthStr()
  const nextMonthUrl = `${url}${nextMonthStr}`
  return nextMonthUrl
}
function addPrevMonthLink() {
  const prevMonthStr = calendar.getPrevMonthStr()
  const prevMonthUrl = `${url}${prevMonthStr}`
  return prevMonthUrl
}

function delRenderedTasks(parentUlEl) {
  Array.from(parentUlEl.querySelectorAll('li')).forEach((el) => el.remove())
}

function addEventBtnRemoveTask(parentUlEl) {
  Array.from(parentUlEl.querySelectorAll('.delete-btn')).forEach((el) => {
    el.addEventListener('click', deleteTask)
  })
}

function renderTasks(parentUlEl, tasksAr) {
  for (const task of tasksAr) {
    const taskEl = ` <li class="list-el-task" >
            <div class="day-task horizontal-flex" >
            <div class="task-wrapper vertical-flex">
              <header>
                <h3 class="event-title">${task.taskName}</h3>
                <span>por ${task.userName}</span>
              </header>
              <p>
                Horario:<span
                  >${task.startHour
                    .toString()
                    .padStart(2, '0')}:${task.startMinutes
      .toString()
      .padStart(2, '0')}</span
                >/<span
                  >${task.endHour.toString().padStart(2, '0')}:${task.endMinutes
      .toString()
      .padStart(2, '0')}</span
                >
              </p>
              </div>
                <button class="delete-btn" data-task-id="${
                  task._id
                }">Eliminar</button>
            </div>
          </li>`
    parentUlEl.insertAdjacentHTML('beforeend', taskEl)
  }
}

// handlers
async function activateDialogHandler(e) {
  const clickedEl = e.target
  if (clickedEl.dataset.fulldate) {
    taskDateEl.value = clickedEl.dataset.fulldate
    const [year, month, day] = clickedEl.dataset.fulldate.split('-')
    taskDateLblEl.textContent = `${day}/${Number(month) + 1}/${year}`
    const tasks = await fetchTasks(`/tasks/${year}/${Number(month) + 1}/${day}`)
    renderTasks(tasksListEl, tasks)
    addEventBtnRemoveTask(tasksListEl)
    addTaskModalEl.showModal()
  }
}

async function initHandler() {
  tasksState = await fetchTasks(`/tasks/${year}/${month}`)
  if (tasksState) {
    calendar.populateCalendar(tasksState)
    calendar.writeMonth(monthNameEl)
    nextMonthBtn.setAttribute('href', addNextMonthLink())
    prevMonthBtn.setAttribute('href', addPrevMonthLink())
  }
}

// events
window.addEventListener('load', initHandler)

closeDialogBtnEl.addEventListener('click', (e) => {
  clearFormInputs()
  delRenderedTasks(tasksListEl)
  addTaskModalEl.close()
})

calendarTableEl.addEventListener('click', activateDialogHandler)
