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
// month from 1 -> 12, to 0 -> 11 scale
const month = (Number(parameters[3]) - 1).toString()
const url = `/${endpoint}/`

let tasksState = null

const calendar = new Calendar(year, month)

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

function renderTasks(parentUlEl, tasksAr) {
  for (const tasks of tasksAr) {
    const taskEl = ` <li>
            <div class="day-task vertical-flex">
              <header>
                <h3 class="event-title">${tasks.taskName}</h3>
                por <span>${tasks.userId}</span>
              </header>
              <p>
                Horario:<span
                  >${tasks.startHour}:<%= ${tasks.startMinutes}</span
                >/<span
                  >${tasks.endHour}:${tasks.endMinutes}</span
                >
              </p>
              <p>Eliminar</p>
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
    taskDateLblEl.textContent = `${day}/${month}/${year}`
    const tasks = await fetchTasks(`/tasks/${year}/${month}/${day}`)
    console.log(tasks)
    renderTasks(tasksListEl, tasks)
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
  addTaskModalEl.close()
})

calendarTableEl.addEventListener('click', activateDialogHandler)
