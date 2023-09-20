<script setup>
import WeekPlaner from '../components/recipe/WeekPlaner.vue'
import NavFooter from '@/components/NavFooter.vue'
</script>

<template>
  <main class="plan-view">
    <WeekPlaner />
  </main>
  <footer>
    <NavFooter />
  </footer>
</template>

<style scoped>
.plan-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  color: #fdfefe;
  background: linear-gradient(180deg, #31c48d 0%, #328165 100%);
}
</style>
