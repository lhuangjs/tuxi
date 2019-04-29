import Storage from 'electron-store'
// const schema = {
//
// }
const storage = new Storage()
storage.set('allTags', ['Java'])
storage.set('allIssues', [])
export default {
  storage
}
