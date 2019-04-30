import Storage from 'electron-store'
// const schema = {
//
// }
const storage = new Storage()
storage.set('allTags', ['java', 'java8'])
storage.set('allIssues', [{
  title: 'learning java8',
  tags: ['java', 'java8'],
  context: '#### go go!!',
  date: new Date().getTime()
}])
export default {
  storage
}
