export function formatDate(date) {
  const currentDate = new Date(date)

  return (
    currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString()
  )
}

export function formatDateWithoutTime(date) {
  const currentDate = new Date(date)

  return currentDate.toLocaleDateString()
}

export function getPageNum(num) {
  if (num === 0) {
    return 10
  }

  return (num - 1) * 10
}

export function isEmptyObject(obj) {
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      return false
    }
  }

  return true
}

export function getDayMinuteSecondsByNumber(sec) {
  if (sec === 0) {
    return '-'
  }

  const seconds = Math.ceil(sec)
  // const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds / 60 / 60))
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  // const dDisplay = d > 0 ? d + '' : ''
  const hDisplay = h > 0 ? h + '' : ''
  const mDisplay = m > 0 ? m + '' : ''
  const sDisplay = s > 0 ? s + '' : ''

  return hDisplay.toString().padStart(2, '0') + ":"
      + mDisplay.toString().padStart(2, '0') + ":"
      + sDisplay.toString().padStart(2, '0')
}

export function isEmptyString(str) {
  if (str.trim() === '') return true

  return false
}
