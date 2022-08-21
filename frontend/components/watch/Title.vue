<script setup>
const getSecondTitle = (data) => {
    return `${data.title.split('/')[1]}, ${new Date(data.date).toLocaleDateString()}, `
}

defineProps({
    anime: {
        type: Object,
        default: () => {}
    }
})
</script>

<template>
<h1 class="font-bold text-2xl">
    {{ anime.attributes.title.split('/')[0] }}
</h1>
<h2 class="font-regular opacity-70 md:text-xl">
    {{ getSecondTitle(anime.attributes) }} {{ `${anime.attributes.maxepisodes == 1 ?
            $t('film') : anime.attributes.nowepisode + ' ' + $t('iz') + ' ' +
            anime.attributes.maxepisodes + ' ' + $t('ep')}`
    }}
</h2>
</template>