import storage from 'electron-json-storage'
import Promise from 'bluebird'
import cons from '../Constant.js'

Promise.promisifyAll(storage)
storage.getAsync(cons.DB_PATH.key, cons.DB_PATH.option)
  .then(function (d) {
    if (!(Object.keys(d).length === 0 && d.constructor === Object)) {
      storage.setDataPath(d[cons.DB_PATH.key])
    }
  })

/** test data **/
storage.setAsync('allTags', ['java', 'java8'], function (err) {
  if (err) throw err
})
storage.setAsync('allIssues',
  [{
    title: 'learning java8',
    tags: ['java', 'java8'],
    context: '#### go go!!',
    date: new Date().getTime()
  }],
  function (err) {
    if (err) throw err
  })
console.log(storage.getDataPath())
export default {
  storage
}
