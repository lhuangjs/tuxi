<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid fill-height class="ma-0 pa-0">
    <v-layout row>
      <!--1. navigation-->
      <v-flex md2>
        <v-navigation-drawer
          permanent
        >
          <v-list>
            <v-list-tile
              v-for="tag in tags"
              :key="tag"
              @click="getIssuesByTag(tag)"
              :class="[activeTag === tag ? 'focused-tile' : '']"
            >
              <v-list-tile-action>
                <v-icon>mdi-tag</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{tag}}</v-list-tile-title>
              </v-list-tile-content>

              <!--tag setting-->
              <v-list-tile-action>
                <v-layout row>
                  <v-flex>
                    <v-btn small icon color="primary">
                      <v-icon>mdi-lead-pencil</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex>
                    <v-btn small icon color="error">
                      <v-icon>mdi-delete-forever</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
      </v-flex>
      <!--2. issues component-->
      <v-flex>
        <v-layout row wrap>
          <v-flex ma-3 v-for="issue in showedIssues" :key="issue.title">
            <v-layout column>
              <!--issue title-->
              <v-flex shrink>
                <v-text-field v-model="issue.title" hide-details class="headline issue-title"></v-text-field>
              </v-flex>
              <!--issue previewer-->
              <v-flex class="elevation-2">
                <div class="issue-previewer" @dblclick="openEditor(issue)">
                  <MDPreviewer :context="md2html(issue.context)"></MDPreviewer>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <!--enter edit model when double click previewer-->
    <v-dialog v-model="editing" v-if="editing" scrollable width="600px">
      <v-card height="700px">
        <v-card-text class="pa-0">
          <v-layout column class="elevation-2">
            <!--title-->
            <v-flex shrink>
              <v-text-field v-model="editingIssue.title" hide-details class="headline issue-title"></v-text-field>
            </v-flex>
            <!--editor-->
            <v-flex class="elevation-2">
              <MDEditor
                class="issue-editor"
                :markdownContext="editingIssue.context"
                @md-context-change="changeMDContext"></MDEditor>
            </v-flex>
            <!--previewer-->
            <v-flex>
              <MDPreviewer :context="md2html(editingIssue.context)"></MDPreviewer>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import MDEditor from '@/components/MDEditor.vue'
import MDPreviewer from '@/components/MDPreviewer.vue'

export default {

  name: 'Issues',

  components: { MDEditor, MDPreviewer },

  computed: {
    // all tags
    tags: function () {
      return this.getTags()
    }
  },

  data () {
    return {
      allIssues: [
        {
          title: 'java8 stream',
          tag: 'Java',
          context: '# hello world!',
          date: '2018-10-18'
        },
        {
          title: 'Vuetify list',
          tag: 'Vuetify',
          context: '# Vuetify list point!',
          date: '2018-10-18'
        }
      ],
      activeTag: null,
      // the issues that need to be displayed on the page
      showedIssues: null,
      // enter issue edit model?
      editing: false,
      // the issue currently being editing
      editingIssue: null

    }
  },

  methods: {

    getTags: function () {
      return this.allIssues.map((issue) => issue.tag)
    },

    getIssuesByTag: function (tag) {
      this.activeTag = tag
      this.showedIssues = this.allIssues.filter((issue) => issue.tag === tag)
    },

    md2html: function (mdCtx) {
      return this.md.render(mdCtx)
    },

    openEditor: function (issue) {
      this.editingIssue = issue
      this.editing = true
    },

    changeMDContext: function (mdCtx) {
      this.editingIssue.context = mdCtx
    }
  }
}
</script>

<style scoped>

  /*clicked tag*/
  .focused-tile {
    background-color: #dfdfdf;
  }

  .issue-title >>> input {
    padding: 0 20px 10px 20px;
  }

  .issue-previewer {
    max-height: 300px;
    overflow-y: auto;
  }

  .issue-editor {
    height: 400px;
  }
</style>
