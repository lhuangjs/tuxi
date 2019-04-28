<template>
  <v-container fill-height ma-0 pa-0 fluid>
    <v-layout row>
      <!--1. directory tree-->
      <v-flex md2 v-if="!openPreview">
        <v-card class="dir-card">
          <div class="directory-tree">
            <DirectoryTree></DirectoryTree>
          </div>
        </v-card>
      </v-flex>
      <!--2. editor-->
      <v-flex v-bind:class="[openPreview ? 'md6' : 'md10']">
        <v-container fluid fill-height ma-0 pa-0>
          <v-layout column>
            <!--title-->
            <v-flex shrink>
              <v-text-field v-model="filename" hide-details class="headline editor-title"></v-text-field>
            </v-flex>
            <!--toolbar-->
            <v-flex shrink>
              <v-toolbar flat height="50" color="#d9d9d9">
                <v-spacer></v-spacer>
                <v-btn icon @click="switchPreview">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </v-toolbar>
            </v-flex>
            <v-flex d-flex grow>
              <v-card>
                <textarea class="editor" v-model="markdownContext"></textarea>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <!--markdown previewer-->
      <v-flex md6 v-if="openPreview">
        <div class="previewer" v-html="htmlContext"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import DirectoryTree from '@/components/DirectoryTree.vue'
import MarkdownIt from 'markdown-it'

export default {

  name: 'Notebooks',

  components: { DirectoryTree },

  data () {
    return {
      md: new MarkdownIt(),
      filename: this.getDate(),
      markdownContext: null,
      htmlContext: null,
      openPreview: false
    }
  },

  methods: {

    /**
       * Make date formatted as title
       */
    getDate: function () {
      const date = new Date()
      return [date.getFullYear(), date.getMonth(), date.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds()].join('-')
    },

    /**
       * Open or close markdown preview
       */
    switchPreview: function () {
      this.openPreview = !this.openPreview
    }
  },

  watch: {
    openPreview: function (val) {
      if (val === true) {
        this.htmlContext = this.md.render(this.markdownContext)
      }
    },

    markdownContext: function (val) {
      console.log(val)
      if (this.openPreview) {
        this.htmlContext = this.md.render(this.markdownContext)
      }
    }
  }
}
</script>

<style scoped>

  .dir-card {
    height: 100%;
    padding: 10px;
  }

  .directory-tree {
    height: 100%;
    overflow-x: auto;
  }

  .editor-title >>> input {
    padding: 0 20px 10px 20px;
  }

  .editor {
    width: 100%;
    height: 100%;
    padding: 40px 40px 80px 40px;
    font-size: 16px;
    line-height: 1.75;
    outline: none;
  }

  .previewer {
    background-color: #fcfaf2;
    padding: 40px 40px 80px 40px;
    overflow-y: auto;
    line-height: 1.75;
    font-size: 16px;
    height: 100%;
  }
</style>
