<template>
  <v-container fluid fill-height class="ma-0 pa-0">
    <v-layout row>
      <!--1. navigation-->
      <v-flex md2>
        <v-navigation-drawer
          permanent
        >
          <v-list>
            <v-list-tile
              v-for="tag in allTags"
              :key="tag"
              @click="getIssuesByTag(tag)"
              :class="[activeTag === tag ? 'focused-tile' : '']"
            >
              <v-list-tile-action>
                <v-icon :color="activeTag === tag ? '#ea7659' : 'black'">mdi-tag</v-icon>
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
        <v-layout column>
          <!--add issue-->
          <v-flex ma-3>
            <v-btn block color="info" class="elevation-6" @click="addIssue">添加 issue</v-btn>
          </v-flex>
          <!--issues preview-->
          <v-flex>
            <v-layout row wrap>
              <v-flex class="elevation-5  ma-3" v-for="issue in selectedIssues" :key="issue.title">
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
      </v-flex>
    </v-layout>
    <!--enter edit model when double click previewer-->
    <v-dialog v-model="editModel" width="800px">
      <IssueEditor
        :allTags="allTags"
        :editingIssue="editingIssue"
        v-if="editModel"
      ></IssueEditor>
    </v-dialog>
  </v-container>
</template>

<script>
import MDPreviewer from '@/components/MDPreviewer.vue'
import IssueEditor from '@/components/IssueEditor.vue'

export default {

  name: 'Issues',

  components: { IssueEditor, MDPreviewer },

  created () {
    this.allTags = this.storage.get('allTags')
    this.activaTag = this.allTags.length === 0 ? null : this.allTags[0]
    this.selectedIssues = this.getIssuesByTag(this.activaTag)
  },

  data () {
    return {
      allIssues: [
        {
          title: 'java8 stream',
          tag: ['Java'],
          context: '# hello world!',
          date: '2018-10-18'
        },
        {
          title: 'Vuetify list',
          tag: ['Vuetify'],
          context: '# Vuetify list point!',
          date: '2018-10-18'
        }
      ],
      allTags: null,
      // selected tag
      activeTag: null,
      // the issues that need to be displayed on the page
      selectedIssues: null,
      // enter issue edit model?
      editModel: false,
      // the issue currently being editing
      editingIssue: null
    }
  },

  methods: {

    /**
       * @param tag
       */
    getIssuesByTag: function (tag) {
      this.activeTag = tag
      this.selectedIssues = this.allIssues
        .filter(issue => issue.tags.indexOf(tag) !== -1)
    },

    /**
       * Open issue editor
       *
       * @param issue
       */
    openEditor: function (issue) {
      this.editingIssue = issue
      this.editModel = true
    },

    addIssue: function () {
      let issue = {
        title: '',
        tags: [],
        context: '',
        date: new Date().getTime()
      }
      this.allIssues.push(issue)
      this.storage.set('allIssues', this.allIssues)
      this.openEditor(issue)
    },

    /**
       * Convert markdown context to html context
       * @param mdCtx
       * @returns
       */
    md2html: function (mdCtx) {
      return this.md.render(mdCtx)
    }
  },

  watch: {
    editingIssue: {
      handler: function () {
        this.storage.set('allIssues', this.allIssues)
        console.log('all issues in storage')
        console.log(this.storage.get('allIssues'))
        console.log('all issues in var')
        console.log(this.allIssues)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .focused-tile {
    background-color: #c8d9eb;
  }

  .issue-title >>> input {
    padding: 0 20px 10px 20px;
  }
</style>
