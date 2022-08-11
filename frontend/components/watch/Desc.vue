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
<div v-if="anime.attributes.description != null" class="mt-[30px]">
        <div class="font-bold text-2xl">{{ $t('desc') }}</div>
        <div class="mt-[15px]" v-html="anime.attributes.description.split('\\n').join('<br/>')"></div>
    </div>
</template>