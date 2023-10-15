const nextBtn = document.querySelector('.next-month-btn')
const prevBtn = document.querySelector('.prev-month-btn')

// Date state
class Calendar {
  constructor() {
    this.date = new Date()
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
      document.getElementById(`${cell}`).textContent = ''
    }
  }

  populateCalendar() {
    for (
      let cell = this.getStartingCell(), date = 1;
      date <= this.getEndMonthLastDate();
      date++, cell++
    ) {
      document.getElementById(`${cell}`).textContent = date
    }
  }
}

const calendar = new Calendar()

// handlers
function nextMonthHandler() {
  calendar.setNextMonth()
  calendar.clearCellsCalendar()
  calendar.populateCalendar()
}
function prevMonthHandler() {
  calendar.setNextMonth()
  calendar.clearCellsCalendar()
  calendar.populateCalendar()
}

// events
window.addEventListener('load', () => {
  calendar.populateCalendar()
})

nextBtn.addEventListener('click', nextMonthHandler)
prevBtn.addEventListener('click', prevMonthHandler)
