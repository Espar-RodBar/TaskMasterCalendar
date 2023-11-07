export class Calendar {
  constructor(year, month) {
    this.date = new Date(year, month)
    this.todayDate = new Date()
    this.todayDateStrdateStr = `${this.todayDate.getFullYear()}-${this.todayDate.getMonth()}-${this.todayDate.getDate()}`
    this.monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
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
      cellEl.classList.remove('today', 'task')
    }
  }

  writeMonth(htmlEl) {
    htmlEl.textContent = `${
      this.monthNames[this.date.getMonth()]
    } ${this.date.getFullYear()}`
  }

  populateCalendar(tasks = []) {
    const taskDays = tasks.map((el) => el.day)

    for (
      let cell = this.getStartingCell(), date = 1;
      date <= this.getEndMonthLastDate();
      date++, cell++
    ) {
      const cellEl = document.getElementById(`cel${cell}`)
      cellEl.textContent = date
      const fulldateStr = `${this.date.getFullYear()}-${this.date.getMonth()}-${date}`

      // mark if this day have a task
      if (taskDays.includes(date)) cellEl.classList.add('task')

      // mark if is today
      if (fulldateStr === this.todayDateStrdateStr)
        cellEl.classList.add('today')
      cellEl.dataset.fulldate = fulldateStr
    }
  }
}
