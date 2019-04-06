const axios = require('axios')
const { getBiodata, removeTag } = require('./helper');

axios.get('https://jkt48.com/member/detail/id/180?lang=id')
.then(({data}) => {
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
  console.log(result)
})
.catch(err => console.log(err))