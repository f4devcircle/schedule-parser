const removeTag = html => html.replace(/<[^>]*>/g, '')
const replaceTrailingTd = td => td.replace(/<\/td>/g, '\n')
const cleanString = tabbed => tabbed.replace(/\t/g, '').replace(/\n/g, '')
const getTableTag = table => table.match(/(<table[^>]*>(?:.|\n)*?<\/table>)/g)
const getTrTag = tr => tr.match(/<tr[\s\S]*?<\/tr>/g)
const getTdTag = td => td.match(/<td[\s\S]*?<\/td>/g)
const replaceBr = (br, replaceTo = ' ') => br.replace(/<br>/g, replaceTo)
const splitBy = (string, by = ' ') => string.split(by)

module.exports = {
  removeTag,
  replaceTrailingTd,
  cleanString,
  getTableTag,
  getTrTag,
  getTdTag,
  replaceBr,
  splitBy,
}