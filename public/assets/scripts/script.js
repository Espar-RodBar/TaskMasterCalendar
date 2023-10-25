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
const month = parameters[3] - 1
const day = parameters[4]
const url = `/${endpoint}/`
const todayDate = new Date()

const taskComponentHTML = `<li>
            <div class="day-event vertical-flex">
              <header>
                <h3 class="event-title">{%title%}</h3>
                por <span>{%user%}</span>
              </header>
              <p>
                Horario:<span>{%start%}</span>/<span>{%end%}</span>
              </p>
              <p>Eliminar</p>
            </div>
          </li>`

class Calendar {
  constructor(year, month) {
    this.date = new Date(year, month)
    this.todayDateStrdateStr = `${todayDate.getFullYear()}-${todayDate.getMonth()}-${todayDate.getDate()}`
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

  getNextMonthStr() {
    const nextDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1)
    return `${nextDate.getFullYear()}/${nextDate.getMonth() + 1}`
  }

  getPrevMonthStr() {
    const prevDate = new Date(this.date.getFullYear(), this.date.getMonth())
    return `${prevDate.getFullYear()}/${prevDate.getMonth()}`
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

      if (fulldateStr === this.todayDateStrdateStr)
        cellEl.classList.add('today')
      cellEl.dataset.fulldate = fulldateStr
    }
  }
}

const calendar = new Calendar(year, month)

// helpers
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
window.addEventListener('load', () => {
  calendar.populateCalendar()
  calendar.writeMonth(monthNameEl)
  nextMonthBtn.setAttribute('href', addNextMonthLink())
  prevMonthBtn.setAttribute('href', addPrevMonthLink())
})

closeDialogBtnEl.addEventListener('click', (e) => {
  clearFormInputs()
  addTaskModalEl.close()
})

calendarTableEl.addEventListener('click', activateDialogHandler)
