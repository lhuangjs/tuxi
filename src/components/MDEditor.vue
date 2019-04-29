<template>
  <div class="editor">
    <textarea
      :value="value"
      @input="$emit('input', $event.target.value)"></textarea>
  </div>
</template>

<script>
export default {

  name: 'MDEditor',

  props: ['value']
}
</script>

<style scoped>
  .editor textarea{
    width: 100%;
    height: 100%;
    padding: 20px;
    outline:none;
    font-size: 16px;
    line-height: 1.75;
  }
</style>
