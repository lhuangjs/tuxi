<template>
  <v-card>
    <v-toolbar>
      <v-btn icon>
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <div class="markdown">
        <textarea class="editor" v-model="markdownText"></textarea>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import MarkdownIt from 'markdown-it'

export default {
  name: 'MarkdownEditor',

  data () {
    return {
      markdownText: null,
      md: new MarkdownIt()
    }
  },

  methods: {},

  watch: {
    markdownText: function (val) {
      this.$emit('content-change', this.md.render(val))
    }
  }
}
</script>

<style scoped>
  .markdown {
    width: 100%;
    height: 100%;
    border: 1px solid red;
  }

  .editor {
    width: 100%;
    height: 1000px;
    font-size: 18px;
  }
</style>
