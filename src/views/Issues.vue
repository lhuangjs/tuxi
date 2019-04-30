<template>
  <v-container fluid fill-height class="ma-0 pa-0">
    <v-layout row>
      <!--1. navigation-->
      <v-flex md3>
        <v-navigation-drawer
          permanent
        >
          <v-list>
            <!--add tag-->
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>mdi-tag-plus</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-text-field
                  v-model="addedTag"
                  @keyup.native.enter="addTag"></v-text-field>
              </v-list-tile-content>
            </v-list-tile>
            <!--show tags-->
            <v-list-tile
              v-for="(tag, index) in allTags" :key="tag.name"
              @click="focusOnTag(tag)"
              :style="{backgroundColor: activeTag === tag ? 'focused-tile' : ''}"
            >
              <!--pre-icon-->
              <v-list-tile-action>
                <v-icon :color="activeTag === tag ? '#ea7659' : ''">mdi-tag</v-icon>
              </v-list-tile-action>
              <!--text field-->
              <v-list-tile-content>
                <v-text-field v-if="modifiedTagIndex=== index"
                              :value="tag"
                              @input="modifyTagContext"
                              @keyup.native.enter="submitModifiedTag"
                >
                </v-text-field>
                <v-list-tile-title v-else>{{tag}}</v-list-tile-title>
              </v-list-tile-content>
              <!--tag setting-->
              <v-list-tile-action>
                <v-layout row>
                  <v-flex>
                    <v-btn small icon color="primary" @click="modifyTag(index)">
                      <v-icon>mdi-lead-pencil</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex>
                    <v-btn small icon color="error" @click="delTag">
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
              <!--a preview container-->
              <v-layout class="elevation-5  ma-3" v-for="issue in selectedIssues" :key="issue.title">
                <v-layout column>
                  <!--issue title-->
                  <v-flex shrink>
                    <div class="headline elevation-1 issue-title">{{issue.title}}</div>
                  </v-flex>
                  <!--tag-->
                  <v-flex class="elevation-1">
                    <v-chip v-for="tag in issue.tags" :key="tag"
                            class="ml-2"
                            small
                            color="green" text-color="white"
                    >
                      <v-avatar class="green darken-4">{{tag[0].toUpperCase()}}</v-avatar>
                      {{tag}}
                    </v-chip>
                  </v-flex>
                  <!--issue previewer-->
                  <v-flex class="elevation-2">
                    <div class="issue-previewer" @dblclick="openEditor(issue)">
                      <MDPreviewer :context="md2html(issue.context)" class="previewer"></MDPreviewer>
                    </div>
                  </v-flex>
                </v-layout>
              </v-layout>
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
        @add-new-tag="addTagFromEditor"
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
      this.allIssues = this.storage.get('allIssues')
      if (this.allTags.length !== 0) {
        this.focusOnTag(this.allTags[0])
      }
    },

    computed: {},

    data () {
      return {
        allIssues: null,
        allTags: null,
        // to save tag that will be added
        addedTag: null,
        // the index of tag that is being modified
        modifiedTagIndex: null,
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
      focusOnTag: function (tag) {
        this.activeTag = tag
        this.selectedIssues = this.allIssues
          .filter(issue => issue.tags.indexOf(tag) !== -1)
      },

      /**
       * Add tag into all tags array when the enter key is pressed
       */
      addTag: function () {
        if (this.allTags.indexOf(this.addedTag) === -1) {
          this.allTags.push(this.addedTag)
          this.addedTag = null
        }
      },

      /**
       * Add tag from issue editor into all tags array when the enter key is pressed
       */
      addTagFromEditor: function (newTag) {
        if (this.allTags.indexOf(newTag) === -1) {
          this.allTags.push(newTag)
        }
      },

      /**
       * Display text field
       */
      modifyTag: function (index) {
        this.modifiedTagIndex = index
      },

      modifyTagContext: function (value) {
        this.allTags[this.modifiedTagIndex] = value
      },

      /**
       * Add modified tag into all tags array when the enter key is pressed
       */
      submitModifiedTag: function () {
        // make the observer can listen the change of array
        let value = this.allTags[this.modifiedTagIndex]
        this.allTags.splice(this.modifiedTagIndex, 1, value)
        this.modifiedTagIndex = null
      },

      delTag: function () {
        let index = this.allTags.indexOf(this.activeTag)
        this.allTags.splice(index, 1)
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
      allTags: {
        handler: function (val, oldVal) {
          console.log('new tags')
          console.log(val)
          console.log('old tags')
          console.log(oldVal)
          this.storage.set('allTags', this.allTags)
        },
        deep: true
      },

      allIssues: {
        handler: function (val, oldVal) {
          console.log('new issues')
          console.log(val)
          console.log('old issues')
          console.log(oldVal)
          this.storage.set('allIssues', this.allIssues)
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

  .issue-title {
    padding: 10px 10px 10px 20px;
  }

  .previewer {
    height: 200px;
    width: 400px;
  }
</style>
