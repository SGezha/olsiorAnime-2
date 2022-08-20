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
    <NuxtLink :to="`/watch/${card.url}`"
        class="w-100 relative will-change-transform transition-transform hover:scale-[102%]">
        <div class="card rounded-md">
            <figure class="w-100 h-[30vh] lg:h-[360px]">
                <img class="w-full h-full object-cover bg-base-100" loading="lazy"
                    :src="`${config.public.apiBase}${card.poster.data.attributes.url}`" />
            </figure>
            <div
                class="stars flex text-md font-medium items-center bg-neutral text-neutral-content w-fit absolute shadow-lg top-[10px] left-[10px] gap-[5px] rounded-md px-[5px] py-[2px]">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                    role="img" class="iconify iconify--material-symbols" width="18" height="18"
                    preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M8 14q-.425 0-.713-.288Q7 13.425 7 13t.287-.713Q7.575 12 8 12t.713.287Q9 12.575 9 13t-.287.712Q8.425 14 8 14Zm4 0q-.425 0-.712-.288Q11 13.425 11 13t.288-.713Q11.575 12 12 12t.713.287Q13 12.575 13 13t-.287.712Q12.425 14 12 14Zm4 0q-.425 0-.712-.288Q15 13.425 15 13t.288-.713Q15.575 12 16 12t.712.287Q17 12.575 17 13t-.288.712Q16.425 14 16 14ZM5 22q-.825 0-1.413-.587Q3 20.825 3 20V6q0-.825.587-1.412Q4.175 4 5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588Q21 5.175 21 6v14q0 .825-.587 1.413Q19.825 22 19 22Zm0-2h14V10H5v10Z">
                    </path>
                </svg>
                {{ new Date(card.date).toLocaleDateString() }}
            </div>
            <div v-if="card.stars > 0"
                class="stars flex text-lg font-medium items-center bg-neutral text-neutral-content w-fit absolute shadow-lg bottom-[10px] right-[10px] rounded-md px-[5px] py-[2px]">
                {{ card.stars }}
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                    role="img" class="iconify iconify--ic" width="24" height="24" preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z">
                    </path>
                </svg>
            </div>
            <div v-if="!card.watched"
                class="stars flex text-lg font-medium items-center bg-neutral text-neutral-content w-fit absolute shadow-lg bottom-[10px] right-[10px] rounded-md px-[5px] py-[2px]">
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
    animation: showCard 0.25s ease-in-out;
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