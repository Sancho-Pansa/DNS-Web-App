<script setup lang="ts">
import RecordView from "@/views/RecordView.vue"
import ControlBar from "./components/ControlBar.vue"
</script>

<template>
  <header class="flex h-1/6 p-6">
    <ControlBar></ControlBar>
  </header>
  <main class="p-6">
    <RecordView></RecordView>
  </main>
</template>

<style scoped></style>
