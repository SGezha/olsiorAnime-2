<script setup>
const router = useRouter()
const config = useRuntimeConfig()
const load = useState(() => false)
const animeSort = useState(() => 'date')
const searchQuery = useState(() => '')
const { find } = useStrapi4()
const { pending, data: animes } = useAsyncData('animes', () => find('animes', { pagination: { pageSize: 50 }, populate: '*' }))

onMounted(() => {
    sortAnime(animeSort.value)
    load.value = true
})

const sortAnime = (type) => {
    animeSort.value = type
    if (animeSort.value == 'date') {
        animes.value.data = animes.value.data.sort((a, b) => new Date(b.attributes.date) - new Date(a.attributes.date))
    }
    if (animeSort.value == 'stars') {
        animes.value.data = animes.value.data.sort((a, b) => b.attributes.stars - a.attributes.stars)
    }
    if (animeSort.value == 'ep') {
        animes.value.data = animes.value.data.sort((a, b) => b.attributes.maxepisodes - a.attributes.maxepisodes)
    }
}

const searchResult = useState(() => [])
const searchAnime = () => {
    let result = []
    let l = searchQuery.value.length
    if (l > 0) {
        for (var i = 0; i < animes.value.data.length; i++) {
            let title = animes.value.data[i].attributes.title
            if (title.toLowerCase().match(searchQuery.value.toLowerCase())) {
                result.push(animes.value.data[i])
            }
        }
    }
    searchResult.value = result
}
</script>

<template>
    <div class="min-h-screen">
        <MyDonate />

        <div
            class="mx-auto max-w-[1350px] w-100 p-[10px] relative flex flex-col gap-[20px] lg:flex-row lg:justify-between items-center">
            <div class="form-control flex w-full lg:w-auto">
                <div class="input-group relative w-full lg:w-auto">
                    <input v-model="searchQuery" @change="searchAnime" type="text" :placeholder="`${$t('search')}...`"
                        class="input input-bordered w-full lg:w-[400px] lg:max-w-[400px]" />
                    <button @click="searchAnime" class="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn px-[20px] lg:px-[40px]" :class="{ 'btn-active': animeSort == 'date' }"
                    @click="sortAnime('date')">{{ $t('sortdate') }}</button>
                <button class="btn px-[20px] lg:px-[40px]" :class="{ 'btn-active': animeSort == 'stars' }"
                    @click="sortAnime('stars')">{{ $t('sortstars') }}</button>
                <button class="btn px-[20px] lg:px-[40px]" :class="{ 'btn-active': animeSort == 'ep' }"
                    @click="sortAnime('ep')">{{ $t('sortep') }}</button>
            </div>
        </div>

        <div v-if="!load"
            class="grid w-100 p-[10px] gap-[15px] md:gap-[30px] xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 mx-auto max-w-[1350px]">
            <MyCardLoad v-for="anime in animes.data.slice(0, 10)" :key="anime.id" />
        </div>
        <div v-if="!pending && load && searchResult.length > 0"
            class="grid w-100 p-[10px] gap-[15px] md:gap-[30px] xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 mx-auto max-w-[1350px]">
            <MyCard v-for="anime in searchResult" :key="anime.id" :card="anime.attributes" :id="anime.id" />
        </div>
        <div v-if="!pending && load && searchResult.length == 0"
            class="grid w-100 p-[10px] gap-[15px] md:gap-[30px] xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 mx-auto max-w-[1350px]">
            <MyCard v-for="anime in animes.data" :key="anime.id" :card="anime.attributes" :id="anime.id" />
        </div>
        <MyFooter />
    </div>
</template>

<style>
@keyframes marquee {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(-100%, 0);
    }
}

.marquee {
    display: block;
    overflow: hidden;
    box-sizing: border-box;
}

.marquee .donate-text {
    display: inline-block;
    width: max-content;

    padding-left: 100%;
    white-space: nowrap;
    /* show the marquee just outside the paragraph */
    will-change: transform;
    animation: marquee 60s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
    .marquee .donate-text {
        animation-iteration-count: 1;
        animation-duration: 0.01;
        /* instead of animation: none, so an animationend event is 
     * still available, if previously attached.
     */
        width: auto;
        padding-left: 0;
    }
}
</style>