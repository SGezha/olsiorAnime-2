<script setup>
const config = useRuntimeConfig()
defineProps({
    card: {
        type: Object,
        default: () => { }
    },
    id: {
        type: Number,
        default: () => 0
    }
})
</script>

<template>
    <NuxtLink :to="`watch/${card.url}`"
        class="w-100 showAnimation relative will-change-transform transition-transform hover:scale-[102%]">
        <div class="card rounded-md">
            <figure class="w-100 h-[30vh] md:h-[360px]">
                <img class="w-full h-full object-cover"
                    :src="`${config.public.apiBase}${card.poster.data.attributes.url}`" alt="Shoes" />
            </figure>
            <div
                class="date glass font-medium w-fit absolute text-primary-content top-[10px] left-[10px] rounded-md px-[5px]">
                {{ new Date(card.date).toLocaleDateString() }}
            </div>
            <div v-if="card.watched"
                class="stars flex text-lg font-medium items-center glass w-fit absolute text-primary-content bottom-[10px] right-[10px] rounded-md px-[5px]">
                {{ card.stars }}
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                    role="img" class="iconify iconify--ic" width="24" height="24" preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z">
                    </path>
                </svg>
            </div>
            <div v-else
                class="stars flex text-lg font-medium items-center glass w-fit absolute text-primary-content bottom-[10px] right-[10px] rounded-md px-[5px]">
                {{ $t('watching') }}
            </div>
        </div>
        <div class="mt-[5px] primary-content">
            <h2 class="font-bold whitespace-nowrap text-ellipsis block overflow-hidden">{{ card.title }}</h2>
            <h3 class="text-[12px] whitespace-nowrap text-ellipsis block overflow-hidden">{{ card.maxepisodes == 1 ?
                    $t('film') : card.nowepisode + ' / ' + card.maxepisodes
            }} • {{
        card.genres.toString().split(',').join(', ')
}}</h3>
        </div>
    </NuxtLink>
</template>


<style>
.showAnimation {
    animation: showCard 0.5s ease-in-out;
}

@keyframes showCard {
    from {
        opacity: 0;
        transform: scale(0.96);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>