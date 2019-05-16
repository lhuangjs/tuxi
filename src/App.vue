<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="app">
    <v-app>
      <v-toolbar color="cyan" dark tabs>
        <v-toolbar-title>TUXI</v-toolbar-title>
        <template v-slot:extension>
          <v-tabs color="transparent">
            <v-tabs-slider color="white"></v-tabs-slider>
            <v-tab v-for="(menuItem, index) in menuItems" :key="menuItem" :to="menuRouters[index]">
              {{ menuItem }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-content>
        <Settings v-if="firstRun" @finish-app-settings="firstRun = false"></Settings>
        <router-view v-else></router-view>
      </v-content>
    </v-app>
  </div>
</template>
<script>

import Settings from './components/Settings'
import cons from './Constant'

export default {

  name: 'App',

  components: { Settings },

  created () {
    this.storage.getAsync(cons.DB_PATH.key, cons.DB_PATH.option)
      .then(d => {
        if (Object.keys(d).length === 0 && d.constructor === Object) {
          this.firstRun = true
        } else {
          this.firstRun = false
        }
      })
  },

  data () {
    return {
      // first run ?
      firstRun: true,
      menuItems: ['笔记', '问题面板', '计划'],
      menuRouters: ['/', '/Issues', '/plans']
    }
  }
}
</script>
<style>
  * {
    margin: 0;
    padding: 0;
    text-transform: none !important;
  }
</style>
