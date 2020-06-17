const {
  removeTag,
  replaceTrailingTd,
  getTrTag,
  getTdTag,
  replaceBr,
  getLinkHref,
  splitBy,
} = require('./helper')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta');


const getShow = data => {
  const tr = getTrTag(data)
  const main = tr.slice(1)
  const result = []
  let show = {}
  main.forEach((m, i) => {
    const dataMain = getTdTag(m)
    //first
    if (i % 3 === 0) {
      let key = ''
      dataMain.forEach((t, j) => {
        // first
        if (j === 0) {
          const mainFirst = splitBy(removeTag(replaceBr(t)))
          const showDate = mainFirst.slice(1, 2)[0];
          const showTime = mainFirst.slice(3, 4)[0];
          show.showDay = mainFirst.slice(0, 1)[0].slice(0, -1)
          show.showDate = showDate;
          show.showTime = showTime;
          show.exchangeTime = mainFirst.slice(6, 7)[0]
          show.unixTime = moment(`${showDate} ${showTime}`, 'DD.MM.YYYY HH:mm').unix();
        } else if (j === 1) {
          show.showName = removeTag(replaceBr(t, ''))
        } else if (j === 2) {
          key = splitBy(removeTag(t))[1]
          show.order = {}
        } else if (j === 3) {
          let link = getLinkHref(t) || '';
          const times = splitBy(removeTag(t), ' - ')
          if (link) {
            link = link[0].split('')
            link.pop()
            link = link.join('')
          }
          show.order[key] = {}
          show.order[key].start = showDateParser(times[0])
          show.order[key].end = showDateParser(times[1])
          show.order[key].link = link
        }
      })
    } else {
      key = ''
      dataMain.forEach((t, j) => {
        if (j === 0) {
          key = splitBy(removeTag(t))[1]
        } else if (j === 1) {
          let link = getLinkHref(t) || '';
          const times = splitBy(removeTag(t), ' - ')
          if (link) {
            link = link[0].split('')
            link.pop()
            link = link.join('')
          }
          show.order[key] = {}
          show.order[key].start = showDateParser(times[0])
          show.order[key].end = showDateParser(times[1])
          show.order[key].link = link
        }
      })
    }

    //last
    if ((i + 1) % 3 === 0) {
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
    const splitData = replaceTrailingTd(replaceBr(m))
    const dataMain = splitBy(removeTag(splitData), '\n')
    const eventMemberList = splitBy(removeTag(replaceTrailingTd(m.split('<br/>')[0])), '\n')[2]
    const parseImgIcon = splitData.match(/<img[^>]+src="([^">]+)"/g)
    const isEvent = parseImgIcon.length > 1
    obj.showDate = dataMain[0].split(' ').slice(0, 2)[1]
    obj.showTime = dataMain[0].split(' ').pop()
    obj.title = dataMain[1][0] === ' ' ? dataMain[1].slice(1) : dataMain[1]
    obj.team = teamParser(splitData)
    obj.showMembers = isEvent ? eventMemberList.split(',').slice(0, -1) : dataMain[2].split(',').slice(0, -1)
    obj.isEvent = isEvent
    obj.eventName = isEvent ? eventParser(parseImgIcon[1]) : ''
    obj.eventMember = isEvent ? dataMain[2].split(',').slice(-2).slice(0, -1)[0] : ''
    result.push(obj)
    obj = {}
  })
  return result
}

const eventParser = eventRaw => {
  const getImg = eventRaw.split('.')[1]
  let result = 'Unknown'
  switch (getImg) {
    case 'cat18':
      result = 'Team Bunga Matahari'
      break;
    case 'cat17':
      result = 'Dream Team'
      break;
    case 'cat16':
      result = 'Kandidat Trainee'
      break;
    case 'cat15':
      result = 'Team T'
      break;
    case 'cat14':
      result = 'Theather'
      break;
    case 'cat13':
      result = 'Trainee'
      break;
    case 'cat12':
      result = 'Team KIII'
      break;
    case 'cat11':
      result = 'Team J'
      break;
    case 'cat10':
      result = 'BD-2SHOT'
      break;
    case 'cat9':
      result = 'DVD-2SHOT'
      break;
    case 'cat8':
      result = 'Other'
      break;
    case 'cat7':
      result = 'Graduation 2 SHOT'
      break;
    case 'cat6':
      result = 'GOODS'
      break;
    case 'cat5':
      result = 'BIRTHDAY'
      break;
    case 'cat4':
      result = 'Release'
      break;
    case 'cat3':
      result = 'Media'
      break;
    case 'cat2':
      result = 'Event'
      break;
    case 'cat1':
      result = 'Theater'
      break;
    default:
      break;
  }
  return result
}

const teamParser = raw => {
  const getImg = splitBy(raw, "\n")[1]
    .match(/<img[^>]+src="([^">]+)"/g)[0]
    .split('.')[1]
  let result = 'Unknown'
  switch (getImg) {
    case 'team12':
      result = 'Academy A'
      break;
    case 'team11':
      result = 'Academy A'
      break;
    case 'team10':
      result = 'Trainee'
      break;
    case 'team9':
      result = 'Trainee'
      break;
    case 'team8':
      result = 'Team Bunga Matahari'
      break;
    case 'team7':
      result = 'Dream Team'
      break;
    case 'team6':
      result = 'Kandidat Trainee'
      break;
    case 'team5':
      result = 'Team T'
      break;
    case 'team4':
      result = 'Theater'
      break;
    case 'team3':
      result = 'Trainee'
      break;
    case 'team2':
      result = 'Team KIII'
      break;
    case 'team1':
      result = 'Team J'
      break;
    default:
      break;
  }
  return result
}

const showDateParser = string => {
  return string.split(',')[1].split('WIB')[0].trim();
}

module.exports = {
  getShow,
  getMember,
}