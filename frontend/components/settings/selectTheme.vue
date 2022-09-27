<template>
  <div>
    <select class="select select-sm max-w-[105px]" @change="changeTheme" v-model="theme">
      <option v-for="theme in themes" :key="theme" :value="theme">{{ theme.charAt(0).toUpperCase() + theme.slice(1)  }}</option>
    </select>
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
const theme = useStorage('nuxt-color-mode', 'system')
const colorMode = useColorMode()
const themes = useState(() => ["light", "night", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "coffee", "winter"])

const changeTheme = (event) => {
  localStorage.setItem('nuxt-color-mode', event.target.value)
  document.querySelector('html').dataset.theme = event.target.value
}
</script>
