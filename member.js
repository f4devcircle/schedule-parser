const axios = require("axios");
const {
  cleanString,
  getTableTag,
  getMainContent,
  getDivTag,
  getTrTag,
  getTdTag,
  removeTag,
  replaceBr,
  replaceClearDiv,
  replaceAlamatHadiahDiv,
} = require("./helper");

axios.get('https://jkt48.com/member/list?lang=id')
.then(({ data }) => {
  const content = replaceAlamatHadiahDiv(replaceClearDiv(cleanString(getMainContent(data)[0])))
  const divs = getDivTag(content).slice(0, getDivTag(content).length - 3);
  let imgTemp = ''
  let key = ''
  let result = {}
  divs.forEach((d, i) => {
    const getImg = d.match(/(?<=src=").*?(?=[\?"])/g)
    const getUrl = d.match(/(?<=href=").*?(?=[\?"])/g)
    const getContent = removeTag(replaceBr(d))
    const isTeam = getContent.split(' ')[0] == 'Team'
    const isEnd = getContent.split(' ')[0] == 'Trainee'
    const isImg = getImg !== null
    if (isTeam) {
      key = getContent
    } else {
      if (isImg) {
        imgTemp = getImg[0]
      } else {
        result[getContent] = { ...result[getContent] }
        result[getContent]['team'] = key
        result[getContent]["url"] = `https://jkt48.com${getUrl}`
        result[getContent]['image'] = `https://jkt48.com${imgTemp}`
      }
    }
  })
  console.log('Core Team:', result)
})
.catch(err => {
  console.log(err)
})


axios.get("https://jkt48.com/jkt48-academy/member-academy")
.then(({data}) => {
  const table = getTableTag(data)
  const cleanTable = cleanString(table[0])
  const trTag = getTrTag(cleanTable).slice(0)
  const result = {}
  trTag.forEach(tr => {
    const tdTag = getTdTag(tr).slice(0)
    tdTag.forEach(td => {
      const getImg = td.match(/(?<=src=").*?(?=[\?"])/g)[0]
      const name = removeTag(replaceBr(td)).slice(0, removeTag(replaceBr(td)).length - 2)
      result[name] = {}
      result[name]['image'] = `https://jkt48.com${getImg}`
    })
  })
  console.log('Academy:', result)
})
.catch(err => {
  console.log(err)
})