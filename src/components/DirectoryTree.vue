<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    {{open}}
    <!--directory tree-->
    <v-treeview
      v-if="tree"
      :open="open"
      :items="tree"
      item-key="name"
    >
      <template v-slot:label="{item, open, selected}">
        <v-btn flat class="ma-0 pa-0"
               @contextmenu="openMenu($event, item)"
               @click="clickTreeNode(item)"
        >
          <v-icon v-if="!item.type">
            {{open ? 'mdi-folder-open': 'mdi-folder'}}
          </v-icon>
          <v-icon v-else>
            {{Object.keys(type2icon).indexOf(item.type) !== -1 ? type2icon[item.type] : type2icon['default']}}
          </v-icon>
          {{item.name}}
        </v-btn>
      </template>
    </v-treeview>

    <!--menu displayed on workspace-->
    <v-menu
      v-model="showWSMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list class="ma-0 pa-0">
        <v-list-tile v-for="item in wsMenuItems" :key="item"
                     @click="clickWSMenu($event, item)">
          <v-list-tile-title>{{item}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <!--menu displayed on projects-->
    <v-menu
      v-model="showProMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list class="ma-0 pa-0">
        <v-list-tile v-for="item in proMenuItems" :key="item"
                     @click="clickProMenu($event, item)">
          <v-list-tile-title>{{item}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <v-dialog
      v-if="showDialog"
      v-model="showDialog"
      width="400"
    >
      <v-card>
        <v-card-text>
          <v-text-field v-model="operation.value"
                        :label="operation.label"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel">取消</v-btn>
          <v-btn @click="confirm">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import fs from 'fs'
import path from 'path'

export default {

  name: 'DirectoryTree',

  created () {
    const self = this
    console.log(this.storage.getDataPath())
    this.storage.getAsync('settings')
      .then(d => {
        // init values
        self.settings = d
        self.open.push(self.settings.projectsDirName)
        // scan projects dir
        self.tree = self.getProjectsTree()
        console.log(self.tree)
      })
  },

  computed: {},

  data () {
    return {

      // app settings from db (electron-json-storage)
      settings: null,

      // the tree note need to be opened
      open: [],

      // file type => icon
      type2icon: {
        md: 'mdi-markdown',
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
        default: 'mdi-file-document-box-outline'
      },

      tree: null,

      // show menu ?
      showWSMenu: false,
      showProMenu: false,

      // the menu position
      x: 0,
      y: 0,

      // menu items displayed on workspace
      wsMenuItems: ['新建目录', '新建文档', '重命名', '删除'],

      // menu items displayed on projects
      proMenuItems: ['新建目录', '新建文档', '重命名', '删除'],

      // record the operation of menu
      operation: { key: null, label: null, obj: null, value: null },

      showDialog: false
    }
  },

  methods: {

    /**
       * Get projects directory tree
       * @returns {{name: T, path, children: (*|Array)}[]}
       */
    getProjectsTree: function () {
      return [{
        name: this.settings.paths.projectsPath.split(path.sep).pop(),
        path: this.settings.paths.projectsPath,
        children: this.scanDir(this.settings.paths.projectsPath)
      }]
    },

    /**
       * The event when tree node was clicked
       * @param node
       */
    clickTreeNode: function (node) {
      if (!node.type) {
        this.open.push(node.name)
      } else {
        this.$emit('open-file', node)
      }
    },

    /**
       * Open menus when right click
       */
    openMenu: function (e, item) {
      e.preventDefault()
      this.showWSMenu = false
      this.showProMenu = false
      this.x = e.clientX
      this.y = e.clientY
      console.log(e.target.innerText)
      console.log(item.name)
      this.operation.obj = item
      this.$nextTick(() => {
        if (item.name === this.settings.projectsDirName) {
          this.showWSMenu = true
        } else {
          this.showProMenu = true
        }
      })
    },

    clickWSMenu: function (e, item) {
    },

    clickProMenu: function (e, item) {
      switch (item) {
        case '新建目录':
          this.operation.key = '新建目录'
          this.operation.label = '起个好听的名字'
          this.showDialog = true
          break
        case '新建文档':
          this.operation.key = '新建文档'
          this.operation.label = '见名知意'
          this.showDialog = true
          break
        case '重命名':
          this.operation.key = '重命名'
          this.operation.label = '我到底该叫个啥'
          this.showDialog = true
          break
        case '删除':
          fs.unlinkSync(this.operation.obj.path)
          this.tree = this.getProjectsTree()

          break
      }
      e.stop = () => {
        this.showDialog = true
      }
    },

    confirm: function () {
      const nodePath = this.operation.obj.path
      switch (this.operation.key) {
        case '新建目录':
          let dir
          if (fs.statSync(nodePath).isDirectory()) {
            dir = path.join(nodePath, this.operation.value)
          } else {
            dir = path.join(path.dirname(nodePath), this.operation.value)
          }
          fs.mkdirSync(dir)
          break
        case '新建文档':
          let file
          if (fs.statSync(nodePath).isDirectory()) {
            file = path.join(nodePath, this.operation.value)
          } else {
            file = path.join(path.dirname(nodePath), this.operation.value)
          }
          fs.openSync(file, 'a')
          break
        case '重命名':
          fs.renameSync(nodePath, path.join(path.dirname(nodePath), this.operation.value))
          break
      }
      console.log(this.tree)
      this.tree = this.getProjectsTree()
      console.log(this.tree)
      this.showDialog = false
      this.operation.value = null
    },

    cancel: function () {
      this.showDialog = false
    },

    scanDir: function (dir) {
      const result = []
      let files = fs.readdirSync(dir)
      for (let file of files) {
        let fPath = path.resolve(dir, file)
        let stat = fs.statSync(fPath)
        if (stat.isDirectory()) {
          let children = this.scanDir(fPath)
          console.log(children)
          if (children.length === 0) {
            result.push({
              name: file,
              path: fPath
            })
          } else {
            result.push({
              name: file,
              path: fPath,
              children: children
            })
          }
        } else {
          result.push({
            name: file,
            type: file.split('.').pop(),
            path: fPath
          })
        }
      }
      return result
    }
  }
}
</script>

<style scoped>

</style>
