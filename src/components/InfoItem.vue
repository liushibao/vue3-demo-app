<script setup lang="ts">
import type { IInfo } from '@/models/business';

defineProps<{
  item: IInfo;
}>()
</script>

<template>
  <div style="border-width: 1px;border-color: red; padding: 2px;">
    <div>
      <div>
        <h3>{{ item.name }}</h3>
        <p>{{ item.detail }}</p>
      </div>
    </div>
    <div>
      <div>创建时间：{{ item.createdAt.toString().slice(0, 16).replace("T", " ") }}
      </div>
      <div>联系方式：{{ item.contact }}</div>
    </div>
  </div>
</template>
