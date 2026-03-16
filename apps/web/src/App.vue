<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import CookieBanner from '@/components/CookieBanner.vue'

const auth = useAuthStore()
onMounted(() => auth.initialize())
</script>

<template>
  <RouterView />
  <CookieBanner />
</template>
