<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-treeview
    v-model="tree"
    :open="open"
    :items="items"
    activatable
    item-key="name"
    open-on-click
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="!item.file">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>
        {{ files[item.file] }}
      </v-icon>
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
      ]
    }
  }
}
</script>

<style scoped>

</style>
