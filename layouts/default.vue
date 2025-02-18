<script setup lang="ts">
import { HomeIcon } from '@radix-icons/vue'
</script>

<template>
  <div class="flex justify-center">
    <div class="flex flex-col min-h-screen w-full max-w-3xl md:border-x">
      <header class="p-2 border-b">
        <Button variant="outline" size="icon" @click="navigateTo('/')">
          <HomeIcon class="w-4 h-4" />
        </Button>
      </header>

      <main class="flex-grow">
        <slot />
      </main>

      <footer class="text-slate-400 text-xs p-4 text-center border-t">
        &copy; 2025 - Crafted with ❤️ in Surabaya
      </footer>
    </div>
  </div>
</template>
