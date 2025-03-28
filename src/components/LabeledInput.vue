<script setup lang="ts">

const model = defineModel()
defineProps({
  errors: {
    type: Array<string>,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
});
</script>

<template>
  <div class="flex-space-between">
    <label :for="id">{{ title }}</label>
    <input :id="id" :class="errors.length == 0 ? '' : 'error-input'" v-model="model">
  </div>
  <div v-if="errors.length > 0" class="error"><span v-for="item in errors" :key="item">{{
    item
      }}</span>
  </div>
</template>
