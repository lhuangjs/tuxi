<template>
  <v-container fill-height ma-0 pa-0 fluid>
    <v-layout row>
      <!--1. directory tree-->
      <v-flex md2 class="pa-2 elevation-2 directory-tree" v-if="!openPreview">
        <DirectoryTree @open-file="openFile"></DirectoryTree>
      </v-flex>
      <!--2. editor-->
      <v-flex v-if="fileNode !== null"
              v-bind:class="[openPreview ? 'md6' : 'md10']"
      >
        <v-container fluid fill-height ma-0 pa-0>
          <v-layout column>
            <!--title-->
            <v-flex shrink>
              <v-text-field v-model="fileNode.name"
                            readonly
                            hide-details
                            class="headline editor-title"
              ></v-text-field>
            </v-flex>
            <!--toolbar-->
            <v-flex shrink>
              <v-toolbar flat height="50" color="#d9d9d9">
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon :color="saveFlag == true ? 'info' : 'error'"
                          :title="saveFlag == true ? '已保存' : '保存中'"
                  >
                    mdi-content-save
                  </v-icon>
                </v-btn>
                <v-btn icon @click="switchPreview">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </v-toolbar>
            </v-flex>
            <v-flex d-flex grow>
              <MDEditor v-model="markdownContent"></MDEditor>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <!--markdown previewer-->
      <v-flex md6 v-if="openPreview" ma-0 pa-0>
        <v-container fluid fill-height ma-0 pa-0>
          <v-layout colum>
            <v-flex><MDPreviewer :context="htmlContent" class="md-previewer"></MDPreviewer>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import DirectoryTree from '@/components/DirectoryTree.vue'
import MDEditor from '@/components/MDEditor.vue'
import MDPreviewer from '@/components/MDPreviewer.vue'
import fs from 'fs'

export default {

  name: 'Notebooks',

  components: { DirectoryTree, MDEditor, MDPreviewer },

  data () {
    return {
      // need to choose workspace and set git repository when first run
      firstRun: true,
      // the file been opened: { name: fileName, type: fileType, path: filePath }
      fileNode: null,
      // the content of file been opened
      markdownContent: null,
      // the content of file been converted and the context will be displayed in previewer
      htmlContent: null,
      // open preview?
      openPreview: false,
      // modification has been saved into file ?
      saveFlag: true
    }
  },

  methods: {

    /**
       * Open file to display in editor
       * @param node { name: fileName, type: fileType, path: filePath }
       */
    openFile: function (node) {
      this.fileNode = node
      const self = this
      fs.readFile(node.path, 'utf8', function (err, data) {
        if (err) throw err
        self.markdownContent = data
      })
    },

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
        this.htmlContent = this.md.render(this.markdownContent)
      }
    },

    markdownContent: function (val) {
      this.saveFlag = false
      fs.writeFile(this.fileNode.path, val, { encoding: 'utf8', flag: 'w' }, (err) => {
        if (err) throw err
        this.saveFlag = true
      })
      if (this.openPreview) {
        this.htmlContent = this.md.render(this.markdownContent)
      }
    },

    saveFlag: function (val, oldVal) {
      console.log('save flag ... ')
      console.log(val)
      console.log(oldVal)
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

  .md-previewer {
    background-color: #fcfaf2;
  }
</style>
