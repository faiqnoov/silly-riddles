<script setup lang="ts">
const features = [
  {
    title: 'Simpe Question',
    route: '/ask'
  },
  {
    title: 'Riddle',
    route: '/riddle'
  },
]
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <p>Available Features:</p>
    <div class="flex gap-4 mt-5">
      <div
        v-for="(item, idx) in features"
        :key="idx"
        class="p-4 rounded-lg border cursor-pointer"
        @click="navigateTo(item.route)"
      >
        <p>{{ item.title }}</p>
      </div>
    </div>
  </div>
</template>