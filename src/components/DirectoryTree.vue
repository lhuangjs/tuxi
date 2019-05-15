<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-treeview
    @value="tree"
    :open="open"
    :items="items"
    item-key="name"
  >
    <template v-slot:label="{item, open, selected}">
      <v-menu
        :value="showMenu"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            flat
            :ripple="false"
            class="ma-0 pa-0"
            @contextmenu="openMenus"
          >
            <!--button icon-->
            <v-icon v-if="!item.file">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
              {{ files[item.file] }}
            </v-icon>
            <!--button text-->
            {{item.name}}
          </v-btn>
        </template>
        <v-list ripple>
          <v-list-tile v-for="menuItem in menuItems" :key="menuItem">
            <v-list-tile-title>{{menuItem}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </template>
  </v-treeview>
</template>

<script>
export default {

  name: 'DirectoryTree',

  data () {
    return {
      open: ['projects', 'vue', 'vuetify', 'layout'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel'
      },
      tree: [],
      items: [{
        name: 'projects',
        children: [
          {
            name: 'java',
            children: [
              {
                name: 'java8 stream.md', file: 'md'
              }
            ]
          },
          {
            name: 'vue',
            children: [
              {
                name: 'vuetify',
                children: [
                  { name: 'install.md', file: 'md' },
                  {
                    'name': 'layout',
                    children: [
                      { name: 'layout-1.md', file: 'md' },
                      { name: 'layout-2.md', file: 'md' }
                    ]
                  }
                ]
              },
              { name: 'documents.md', file: 'md' }
            ]
          }
        ]
      }
      ],
      showMenu: false,
      menuItems: ['新建Markdown文档', '新建目录', '重命名', '删除']
    }
  },

  methods: {

    show: function (on) {
      console.log(on)
    },

    /**
       * Open menus when
       */
    openMenus: function (e) {
      // this.showMenu = true
      console.log(this.tree)
      console.log(e)
      e.preventDefault()
    }
  }
}
</script>

<style scoped>

</style>
