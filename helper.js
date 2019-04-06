const removeTag = html => html.replace(/<[^>]*>/g, '')
const replaceTrailingTd = td => td.replace(/<\/td>/g, '\n')
const replaceClearDiv = td => td.replace(/(<div class="clear"><\/div>)/g, '\n')
const replaceAlamatHadiahDiv = td => td.replace(/(<p><div class="readmore"><a href="\/about\/fanletter\?lang=id">Alamat Fan Letter dan Hadiah &rsaquo;<\/a><\/div><\/p>)/g, '\n')
const cleanString = tabbed => tabbed.replace(/\t/g, '').replace(/\n/g, '')
const getTableTag = table => table.match(/(<table[^>]*>(?:.|\n)*?<\/table>)/g)
const getMainContent = divs => divs.match(/(<div id="mainContent"[^>]*>(?:.|\n)*?<\/div><!--end #mainCol-->)/g)
const getBiodata = divs => divs.match(/<div.*class\s*=\s*["'].*bio.*["']\s*>(.*)<\/div>/g);
const getTrTag = tr => tr.match(/<tr[\s\S]*?<\/tr>/g)
const getTdTag = td => td.match(/<td[\s\S]*?<\/td>/g)
const getDivTag = div => div.match(/<div[\s\S]*?<\/div>/g)
const replaceBr = (br, replaceTo = ' ') => br.replace(/<br>/g, replaceTo)
const splitBy = (string, by = ' ') => string.split(by)

module.exports = {
  removeTag,
  replaceTrailingTd,
  replaceClearDiv,
  replaceAlamatHadiahDiv,
  getMainContent,
  cleanString,
  getTableTag,
  getTrTag,
  getTdTag,
  getDivTag,
  replaceBr,
  splitBy,
  getBiodata,
};