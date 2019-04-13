const app = require('express')()
const axios = require('axios')

const {
  cleanString,
  getTableTag,
  getBiodata,
  removeTag,
} = require('./helper')

const {
  getShow,
  getMember,
} = require('./parser')

app.get('/', (req, res) => {
  axios.get('https://jkt48.com/theater/schedule?lang=id')
  .then(({ data }) => {
    const table = getTableTag(data)
    const perform = getShow(cleanString(table[0]))
    const members = getMember(cleanString(table[1]))
    console.log(members)
    const show = []
    let result = {}
    perform.forEach((p, i) => {
      for (let key in p) {
        result[key] = p[key]
      }
      for (let key in members[i]) {
        result[key] = members[i][key];
      }
      show.push(result)
      result = {}
    })

    res.send(show)
    return;
  })
  .catch(err => {
    console.log(err)
  })
})

app.get('/member', (req, res) => {
  const url = req.query.u
  axios.get(url)
  .then(({ data }) => {
    const biodata = getBiodata(data)
    let result = {}
    let key = ''
    biodata.forEach(bio => {
      const isContent = /bioright/.test(bio)
      const content = removeTag(bio)
      if (!isContent) {
        switch (content) {
          case 'Nama':
            result.name = ''
            key = 'name'
            break;
          case 'Tanggal Lahir':
            result.birthdate = ''
            key = 'birthdate'
            break;
          case 'Golongan Darah':
            result.bloodType = ''
            key = 'bloodType'
            break;
          case 'Horoskop':
            result.horoscope = ''
            key = 'horoscope'
            break;
          case 'Tinggi Badan':
            result.height = ''
            key = 'height'
            break;
          case 'Nama Panggilan':
            result.nickname = ''
            key = 'nickname'
            break;
          default:
            result[content]
            key = content
            break;
        }
      } else {
        result[key] = content
      }
    })
    res.send(result)
    return;
  })
  .catch(err => console.log(err))
})

app.listen(3000, () => console.log('on port 3000'))