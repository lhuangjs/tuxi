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
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>
<script>
  export default {
    name: 'App',

    data () {
      return {
        menuItems: ['笔记', '问题面板', '计划'],
        menuRouters: ['/', '/problems', '/plans']
      }
    }
  }
</script>
<style>

</style>

