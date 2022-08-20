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
<div class="px-[12px] py-[16px] mt-[20px] w-full text-sm bg-neutral shadow-lg rounded-md flex flex-col gap-[5px]">
    <div class="text-neutral-content">
        <span>{{ $t('status') }}: </span>
        <span class="text-primary font-bold">{{ anime.attributes.watched ? $t('watched') : $t('watching') }}</span>
    </div>
    <div class="text-neutral-content">
        <span>{{ $t('epwached') }}: </span>
        <span class="text-primary font-bold">{{ `${anime.attributes.maxepisodes == 1 ?
            $t('film') : anime.attributes.nowepisode + ' ' + $t('iz') + ' ' +
            anime.attributes.maxepisodes + ' ' + $t('ep')}`}}</span>
    </div>
    <div class="text-neutral-content">
        <span>{{ $t('watcheddate') }}: </span>
        <span class="text-primary font-bold">{{ new Date(anime.attributes.date).toLocaleDateString() }} </span>
    </div>
    <div class="text-neutral-content">
        <span>{{ $t('genres') }}: </span>
        <span class="text-primary font-bold">{{ anime.attributes.genres.toString().split(',').join(', ') }} </span>
    </div>
</div>
</template>