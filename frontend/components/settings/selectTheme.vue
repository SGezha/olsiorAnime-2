<template>
  <div>
    <select class="select select-sm max-w-[105px]" v-model="$colorMode.preference">
      <option v-for="theme in themes" :key="theme" :value="theme">{{ theme.charAt(0).toUpperCase() + theme.slice(1)  }}</option>
    </select>
  </div>
</template>

<script setup>
const colorMode = useColorMode()  
const themes = useState(() => ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"])
</script>
