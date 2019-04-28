<template>
  <div class="editor">
    <textarea v-model="markdownContext"></textarea>
  </div>
</template>

<script>
export default {

  name: 'MDEditor',

  props: ['markdownContext'],

  watch: {
    markdownContext: function () {
      this.$emit('md-context-change', this.markdownContext)
    }
  }
}
</script>

<style scoped>
  .editor textarea{
    width: 100%;
    height: 100%;
    outline:none;
    font-size: 16px;
    line-height: 1.75;
  }
</style>
