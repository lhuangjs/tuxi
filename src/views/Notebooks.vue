<template>
   <v-container  fill-height>
     <v-layout align-space-around justify-center row>
       <!--directory tree-->
       <v-flex sm3>
         <DirectoryTree></DirectoryTree>
       </v-flex>
       <!--editor-->
       <v-flex sm7>
         <MarkdownEditor v-on:content-change="changePreview"></MarkdownEditor>
       </v-flex>
       <!--markdown previewer-->
       <v-flex sm2>
         <div class="previewer" v-html="previewContent"></div>
       </v-flex>
     </v-layout>
   </v-container>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import DirectoryTree from '@/components/DirectoryTree.vue'

export default {
  name: 'Notebooks',

  components: { MarkdownEditor, DirectoryTree },

  data () {
    return {
      previewContent: ''
    }
  },

  methods: {

    /**
       * Show html content from markdown parser (markdown editor)
       * @param html
       */
    changePreview: function (html) {
      console.log(html)
      this.previewContent = html
    }
  }
}
</script>

<style scoped>

</style>
