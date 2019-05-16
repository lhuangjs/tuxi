<template>
  <v-container>
    <v-layout justify-center>
      <v-card width="600">
        <v-toolbar dark color="cyan">
          <v-toolbar-title>用户设置</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-layout column>
            <v-flex v-for="setting in repoSettings" :key="setting.name">
              <v-text-field :label="setting.name"
                            v-model="setting.value"
              >
              </v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field label="工作空间位置"
                            v-model="workspacePath"
                            @click="selectWS"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-btn block color="primary" @click="submit">确认</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>

import fs from 'fs'
import path from 'path'
import { remote } from 'electron'
import cons from '../Constant.js'

export default {

  name: 'Settings',

  data () {
    return {
      repoSettings: [
        { name: '用户名', value: null },
        { name: '邮箱', value: null },
        { name: '远程仓库链接', value: null }
      ],
      workspacePath: null
    }
  },

  methods: {
    /**
       * Open dialog to select workspace dir
       */
    selectWS: function () {
      this.workspacePath = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })[0]
    },

    /**
       * Submit settings: save settings into db
       */
    submit: function () {
      // db dir: the dir to save configuration, issues and plans.
      const dbPath = path.join(this.workspacePath, 'db')
      // projects dir: the dir to save notes
      const projectsDirName = 'Projects'
      const projectsPath = path.join(this.workspacePath, projectsDirName)
      // image dir: the dir to save image from notes, issues and plans
      const imgPath = path.join(this.workspacePath, 'img')
      // file dir: the dir to save files from notes, issue, and plans
      const filePath = path.join(this.workspacePath, 'files')
      const settings = {
        repo: {
          user: this.repoSettings[0].value,
          email: this.repoSettings[1].value,
          url: this.repoSettings[2].value
        },
        paths: {
          projectsPath: projectsPath,
          imgPath: imgPath,
          filePath: filePath
        },
        projectsDirName: projectsDirName
      }

      /** create dir **/
      for (let path of Object.values(settings.paths)) {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path)
        }
      }

      /** save data **/
      this.storage.setDataPath(dbPath)
      const dbPathObj = {}
      dbPathObj[cons.DB_PATH.key] = dbPath
      // save db location into default path: app_path/(cons.DB_PATH.key).json
      this.storage.setAsync(cons.DB_PATH.key, dbPathObj, cons.DB_PATH.option, function (err) {
        if (err) throw err
      })
      this.storage.setAsync('settings', settings, function (err) {
        if (err) throw err
      })

      this.$emit('finish-app-settings')
    }
  }
}
</script>

<style scoped>

</style>
