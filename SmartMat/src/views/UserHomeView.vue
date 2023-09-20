<script setup>
import Statistics from '@/components/statistics/Statistics.vue'
import GroupSelector from '../components/group/GroupSelector.vue'
import NavFooter from '@/components/NavFooter.vue'
import { useUserStore } from '@/stores/UserStore'
</script>

<template>
  <main class="user-home">
    <GroupSelector />
    <Statistics />
  </main>
  <footer>
    <NavFooter />
  </footer>
</template>

<style scoped>
.user-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #31c48d 0%, #328165 100%);
}
</style>
