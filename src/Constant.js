import { remote } from 'electron'

const DB_PATH = { key: 'dbPath', option: { dataPath: remote.app.getAppPath() } }
export default {
  DB_PATH
}
