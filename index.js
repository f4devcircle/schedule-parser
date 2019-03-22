const axios = require('axios')
const {
  cleanString,
  getTableTag,
} = require('./helper')
const {
  getShow,
  getMember,
} = require('./parser')

axios.get('https://jkt48.com/theater/schedule?lang=id')
.then(({data}) => {
  const table = getTableTag(data)
  const perform = getShow(cleanString(table[0]))
  const members = getMember(cleanString(table[1]))
  const show = []
  perform.forEach((p, i) => {
    show.push({
      ...p,
      ...members[i]
    })
  })
  
  console.log(show)
})
.catch(err => {
  console.log(err)
})