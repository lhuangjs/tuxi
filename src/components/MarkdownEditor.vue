<template>
  <div class="markdown">
    <textarea class="editor" v-model="markdownText"></textarea>
  </div>
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
    height: 100%;
    font-size: 18px;
  }
</style>
