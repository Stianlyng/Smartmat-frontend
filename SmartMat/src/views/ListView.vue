<script setup>
import NavFooter from '@/components/NavFooter.vue'
import ListHeader from '@/components/list/ListHeader.vue'
import InventoryList from '@/components/list/InventoryList.vue'
import ShoppingList from '../components/list/ShoppingList.vue'
import { ref } from 'vue'

const active = ref(0)

function setActive(index) {
  active.value = index
}
</script>

<template>
  <main class="list-view">
    <ListHeader @setActive="setActive($event)" />
    <InventoryList v-if="active === 0" />
    <ShoppingList v-else />
  </main>
  <footer>
    <NavFooter />
  </footer>
</template>

<style scoped>
.list-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #31c48d 0%, #328165 100%);
}
</style>
