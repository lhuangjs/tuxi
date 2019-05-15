<template>
  <v-container fill-height ma-0 pa-0 fluid>
    <v-layout row>
      <!--1. directory tree-->
      <v-flex md2 class="pa-2 elevation-2 directory-tree" v-if="!openPreview">
        <DirectoryTree></DirectoryTree>
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
              <MDEditor v-model="markdownContext"></MDEditor>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <!--markdown previewer-->
      <v-flex md6 v-if="openPreview">
        <MDPreviewer :context="htmlContext" class="md-previewer"></MDPreviewer>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import DirectoryTree from '@/components/DirectoryTree.vue'
import MDEditor from '@/components/MDEditor.vue'
import MDPreviewer from '@/components/MDPreviewer.vue'

export default {

  name: 'Notebooks',

  components: { DirectoryTree, MDEditor, MDPreviewer },

  data () {
    return {
      // need to choose workspace and set git repository when first run
      firstRun: true,
      filename: this.getDate(),
      markdownContext: '',
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

  .directory-tree {
    overflow: auto;
  }

  .editor-title >>> input {
    padding: 0 20px 10px 20px;
  }

  .md-previewer{
    background-color: #fcfaf2;
  }
</style>
