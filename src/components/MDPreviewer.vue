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
    padding: 40px 40px 80px 40px;
    overflow-y: auto;
    line-height: 1.75;
    font-size: 16px;
    height: 100%;
  }
</style>
