<template>
  <div>
    <select class="select select-sm max-w-[105px]" @change="changeTheme">
      <option v-for="theme in themes" :key="theme" :value="theme">{{ theme.charAt(0).toUpperCase() + theme.slice(1)  }}</option>
    </select>
  </div>
</template>

<script setup>
const themes = useState(() => ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"])
const changeTheme = (event) => {
  localStorage.setItem('nuxt-color-mode', event.target.value)
  document.querySelector('html').dataset.theme = event.target.value
}
</script>
