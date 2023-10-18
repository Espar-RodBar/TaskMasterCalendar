//const { send } = require('process')

const nextBtn = document.querySelector('.next-month-btn')
const prevBtn = document.querySelector('.prev-month-btn')
const monthNameEl = document.querySelector('.month-name')
const calendarTableEl = document.querySelector('#calendar-table')
const addTaskModalEl = document.querySelector('#AddTaskDialog')
const closeDialogBtnEl = document.querySelector('#closeDialogBtn')
const taskDateEl = document.querySelector('.taskDate')
const taskDateLblEl = document.querySelector('.taskDatelbl')

class Calendar {
  constructor() {
    this.date = new Date()
    this.todayDateStr = `${this.date.getFullYear()}-${this.date.getMonth()}-${this.date.getDate()}`
    this.monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Setiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
  }

  getStartingCell(
    year = this.date.getFullYear(),
    month = this.date.getMonth()
  ) {
    return new Date(year, month, 1).getDay() || 7
  }

  getEndMonthLastDate(
    year = this.date.getFullYear(),
    month = this.date.getMonth()
  ) {
    return new Date(year, month + 1, 0).getDate()
  }

  setNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1)
  }

  setPrevMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1)
  }

  clearCellsCalendar() {
    for (let cell = 1; cell <= 42; cell++) {
      const cellEl = document.getElementById(`cel${cell}`)
      cellEl.textContent = ''
      cellEl.dataset.fulldate = ''
      cellEl.classList.remove('today')
    }
  }

  writeMonth(htmlEl) {
    htmlEl.textContent = `${
      this.monthNames[this.date.getMonth()]
    } ${this.date.getFullYear()}`
  }

  populateCalendar() {
    for (
      let cell = this.getStartingCell(), date = 1;
      date <= this.getEndMonthLastDate();
      date++, cell++
    ) {
      const cellEl = document.getElementById(`cel${cell}`)
      cellEl.textContent = date
      const fulldateStr = `${this.date.getFullYear()}-${this.date.getMonth()}-${date}`
      if (fulldateStr === this.todayDateStr) cellEl.classList.add('today')
      cellEl.dataset.fulldate = fulldateStr
    }
  }
}

const calendar = new Calendar()

// helpers
function clearFormInputs() {
  document.querySelector('#taskDurationInput').value = '2'
  document.querySelector('#taskTimeInput').value = ''
  document.querySelector('#taskNameInput').value = ''
}

// handlers
function nextMonthHandler() {
  calendar.setNextMonth()
  calendar.clearCellsCalendar()
  calendar.populateCalendar()
  calendar.writeMonth(monthNameEl)
}

function prevMonthHandler() {
  calendar.setPrevMonth()
  calendar.clearCellsCalendar()
  calendar.populateCalendar()
  calendar.writeMonth(monthNameEl)
}

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
window.addEventListener('load', () => {
  calendar.populateCalendar()
  calendar.writeMonth(monthNameEl)
})

closeDialogBtnEl.addEventListener('click', (e) => {
  clearFormInputs()
  addTaskModalEl.close()
})
nextBtn.addEventListener('click', nextMonthHandler)
prevBtn.addEventListener('click', prevMonthHandler)
calendarTableEl.addEventListener('click', activateDialogHandler)
