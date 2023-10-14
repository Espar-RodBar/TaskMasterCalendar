window.addEventListener('load', () => {
  document.getElementById('AddTaskDialog').showModal()
})

// date
const fecha = new Date()
console.log(fecha)
const day = fecha.getDay()
const date = fecha.getDate()
const month = fecha.getMonth()
const year = fecha.getFullYear()
const nowCell = day + date
const startMonthDay = new Date(year, month, 1).getDay() || 7
const endMonthLastDate = new Date(year, month + 1, 0).getDate()

for (
  let cell = startMonthDay, date = 1;
  date <= endMonthLastDate;
  date++, cell++
) {
  document.getElementById(`${cell}`).textContent = date
}

console.log(day, date, month, year)
