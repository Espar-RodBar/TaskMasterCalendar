import { Calendar } from './Calendar.js'

const monthNameEl = document.querySelector('.month-name')
const calendarTableEl = document.querySelector('#calendar-table')
const addTaskModalEl = document.querySelector('#AddTaskDialog')
const closeDialogBtnEl = document.querySelector('#closeDialogBtn')
const taskDateEl = document.querySelector('.taskDate')
const taskDateLblEl = document.querySelector('.taskDatelbl')

const prevMonthBtn = document.querySelector('.prev-month-btn > a')
const nextMonthBtn = document.querySelector('.next-month-btn  a')

const parameters = window.location.pathname.split('/')
const endpoint = parameters[1]
const year = parameters[2]
// month from 1 -> 12, to 0 -> 11 scale
const month = (Number(parameters[3]) - 1).toString()
const day = parameters[4]
const url = `/${endpoint}/`
const todayDate = new Date()

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

// handlers
function activateDialogHandler(e) {
  const clickedEl = e.target
  if (clickedEl.dataset.fulldate) {
    taskDateLblEl.textContent = clickedEl.dataset.fulldate
      .split('-')
      .reverse()
      .join(' ')
    taskDateEl.value = clickedEl.dataset.fulldate
    addTaskModalEl.showModal()
  }
}

// events
window.addEventListener('load', async () => {
  const tasks = await fetchTasks(`/tasks/${year}/${month}`)
  calendar.populateCalendar(tasks)
  calendar.writeMonth(monthNameEl)
  nextMonthBtn.setAttribute('href', addNextMonthLink())
  prevMonthBtn.setAttribute('href', addPrevMonthLink())
})

closeDialogBtnEl.addEventListener('click', (e) => {
  clearFormInputs()
  addTaskModalEl.close()
})

calendarTableEl.addEventListener('click', activateDialogHandler)
