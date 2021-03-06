<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card>
    <v-card-text class="pa-0">
      <v-layout column class="elevation-2">
        <!--title-->
        <v-flex shrink>
          <v-text-field
            solo
            v-model="editingIssue.title"
            hide-details
            class="headline issue-title">
            <template v-slot:append>
              <v-menu absolute>
                <template v-slot:activator="{on}">
                  <v-btn icon  class="pa-0 ma-0" v-on="on">
                    <v-icon>mdi-tag-plus</v-icon>
                  </v-btn>
                </template>
                <template v-slot:default>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-text-field v-model="newTag" @keyup.native.enter="addTag"></v-text-field>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-for="tag in allTags" :key="tag">
                      <v-list-tile-content>
                        <v-checkbox v-model="editingIssue.tags" :label="tag" :value="tag"></v-checkbox>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </template>
              </v-menu>
            </template>
          </v-text-field>
        </v-flex>
        <v-flex class="elevation-1">
          <v-chip v-for="tag in editingIssue.tags" :key="tag"
                  class="ml-2"
                  small
                  color="green" text-color="white"
          >
            <v-avatar class="green darken-4">{{tag[0].toUpperCase()}}</v-avatar>
            {{tag}}
          </v-chip>
        </v-flex>
        <!--editor-->
        <v-flex class="elevation-2">
          <MDEditor
            class="issue-editor"
            v-model="editingIssue.context"></MDEditor>
        </v-flex>
        <!--previewer-->
        <v-flex>
          <MDPreviewer :context="md2html(editingIssue.context)" class="issue-previewer"></MDPreviewer>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import MDEditor from '@/components/MDEditor.vue'
import MDPreviewer from '@/components/MDPreviewer.vue'

export default {

  name: 'IssueEditor',

  components: { MDEditor, MDPreviewer },

  /**
     * editingIssue: the issue that is being edited
     */
  props: ['allTags', 'editingIssue'],

  data () {
    return {
      newTag: null
    }
  },

  methods: {

    /**
       * Convert markdown context to html context
       * @param mdCtx
       * @returns {*}
       */
    md2html: function (mdCtx) {
      return this.md.render(mdCtx)
    },

    addTag: function () {
      this.$emit('add-new-tag', this.newTag)
    }
  }
}
</script>

<style scoped>
  .issue-title >>> input {
    padding: 0 20px 10px 20px;
  }

  .issue-editor {
    height: 400px;
  }

  .issue-previewer {
    max-height: 400px;
    overflow-y: auto;
  }
</style>
