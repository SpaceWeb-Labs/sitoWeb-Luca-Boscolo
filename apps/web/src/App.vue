<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import CookieBanner from '@/components/CookieBanner.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
onMounted(() => auth.initialize())
</script>

<template>
  <RouterView />
  <CookieBanner />
</template>
