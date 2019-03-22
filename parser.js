const {
  removeTag,
  replaceTrailingTd,
  getTrTag,
  getTdTag,
  replaceBr,
  splitBy,
} = require('./helper')

const getShow = data => {
  const tr = getTrTag(data)
  const main = tr.slice(1)
  const result = []
  let show = {}
  main.forEach((m, i) => {
    const dataMain = getTdTag(m)
    //first
    if (i % 3 == 0) {
      let key = ''
      dataMain.forEach((t, j) => {
        // first
        if (j == 0) {
          const mainFirst = splitBy(removeTag(replaceBr(t)))
          show.showDate = mainFirst.slice(0, 2).join(' ')
          show.showTime = mainFirst.slice(3, 4)[0]
          show.exchange = mainFirst.slice(4, 7).join(' ')
        } else if (j == 1) {
          show.title = removeTag(replaceBr(t, ''))
        } else if (j == 2) {
          key = splitBy(removeTag(t))[1]
          show.order = {}
        } else if (j == 3) {
          const times = splitBy(removeTag(t), ' - ')
          show.order[key] = {}
          show.order[key].start = times[0]
          show.order[key].end = times[1]
        }
      })
    } else {
      key = ''
      dataMain.forEach((t, j) => {
        if (j == 0) {
          key = splitBy(removeTag(t))[1]
        } else if (j == 1) {
          const times = splitBy(removeTag(t), ' - ')
          show.order[key] = {}
          show.order[key].start = times[0]
          show.order[key].end = times[1]
        }
      })
    }

    //last
    if ((i + 1) % 3 == 0) {
      result.push(show)
      show = {}
    }
  })
  return result
}

const getMember = member => {
  const result = []
  let obj = {}
  const tr = getTrTag(member)
  const main = tr.slice(1)
  main.forEach((m, i) => {
    const dataMain = splitBy(removeTag(replaceTrailingTd(replaceBr(m))), '\n')
    obj.showDate = dataMain[0].split(' ').slice(0, 2).join(' ')
    obj.showTime = dataMain[0].split(' ').pop()
    obj.title = dataMain[1][0] == ' ' ? dataMain[1].slice(1) : dataMain[1]
    obj.showMember = dataMain[2].split(',').slice(0, -1)
    result.push(obj)
    obj = {}
  })
  return result
}

module.exports = {
  getShow,
  getMember,
}