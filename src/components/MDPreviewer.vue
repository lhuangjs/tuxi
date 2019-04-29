<template>
    <div class="previewer" v-html="context">
    </div>
</template>

<script>
export default {

  name: 'MDPreviewer',

  props: ['context']
}
</script>

<style scoped>
  .previewer {
    padding: 20px;
    overflow-y: auto;
    line-height: 1.75;
    font-size: 16px;
    height: 100%;
  }
</style>
