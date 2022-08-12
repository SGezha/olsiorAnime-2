<script setup>
const config = useRuntimeConfig()
const router = useRouter()
const { findOne, find } = useStrapi4()
const { pending, data: anime } = useAsyncData('anime', () => find('animes', { filters: { url: router.currentRoute._value.params.name }, populate: '*' }))
const loadAnime = useState(() => false)
onMounted(() => {
    loadAnime.value = true
})

// const WatchTitle = defineAsyncComponent(() => import('~/components/watch/Title'))
// const WatchAnimeInfo = defineAsyncComponent(() => import('~/components/watch/AnimeInfo'))
// const WatchPlayer = defineAsyncComponent(() => import('~/components/watch/Player'))
// const WatchDesc = defineAsyncComponent(() => import('~/components/watch/Desc'))
// const WatchInfo = defineAsyncComponent(() => import('~/components/watch/Info'))
</script>

<template>
    <div class="">
         <Head>
            <Title>{{ `${anime.data[0].attributes.title.split("/")[0]} - Олсиор смотрит аниме` }}</Title>
            <Meta name="og-title" hid="og-title" property="og:title" :content="anime.data[0].attributes.title" />
            <Meta name="description" hid="description" :content="anime.data[0].attributes.description" />
            <Meta name="og:description" hid="og:description" property="og:description" :content="anime.data[0].attributes.description" />
            <Meta v-if="anime.data[0].attributes.background.data != null" name="og:image" hid="og:image" property="og:image" :content="`${config.public.apiBase}${anime.data[0].attributes.background.data.attributes.url}`" />
        </Head>
        <div v-if="!loadAnime" style="height: calc(100vh - calc(100vh - 100%))" class="absolute top-0 left-0 w-screen bg-neutral z-50 flex justify-center items-center">
            <img src="/loading.gif" class="rounded-full w-[100px]" alt="">
        </div>
        <div v-if="!pending && loadAnime" class="">
            <div v-if="anime.data[0].attributes.background.data != null"
                class="anime-bg w-[100%] showBg absolute top-0 left-0 -z-10">
                <img loading="lazy" class="w-full object-cover object-center h-[800px] max-h-[800px]"
                    :src="`${config.public.apiBase}${anime.data[0].attributes.background.data.attributes.url}`" alt="">
            </div>
            <div class="max-w-[1350px] mx-auto px-[10px] pb-[50px] md:py-[20px] min-h-screen">
                <div class="flex flex-col pt-[30px] gap-[30px] md:gap-[50px] md:flex-row">
                    <div class="w-full md:w-[300px] md:min-w-[300px]">
                        <div class="block mb-[20px] md:hidden">
                            <WatchTitle :anime="anime.data[0]" />
                        </div>
                        <img class="object-cover rounded-md w-full showAnimation shadow-lg"
                            :src="`${config.public.apiBase}${anime.data[0].attributes.poster.data.attributes.url}`" alt="">
                        
                        <WatchAnimeInfo :anime="anime.data[0]" />
                    </div>

                    <div class="relative w-full showAnimation">
                        <div class="hidden md:block">
                            <WatchTitle :anime="anime.data[0]" />
                        </div>

                        <WatchPlayer :anime="anime.data[0]" />

                        <WatchDesc :anime="anime.data[0]" />

                        <WatchInfo :anime="anime.data[0]" />

                        <WatchComents :url="router.currentRoute._value.params.name" />
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!pending && loadAnime">
            <MyFooter />
        </div>
    </div>
</template>

<style>
.anime-bg img {
    -webkit-mask-image: linear-gradient(0deg, transparent 0, rgba(0, 0, 0, 1));
    mask-image: linear-gradient(0deg, transparent 0, rgba(0, 0, 0, 1));
}

.showBg {
    animation: showBg 2s ease;
}

.active {
    background: hsla(var(--bc) / 1);
    color: hsla(var(--p) / 1);
}

.active:hover {
    background: hsla(var(--bc) / 1);
    color: hsla(var(--p) / 1);
}

.video-menu {
    /* backdrop-filter: blur(10px); */
}

@media(max-width: 600px) {
    .videoBtn {
        width: 100%;
    }
}

.emote {
    display: inline-block;
    height: 15px;
    width: auto;
    transform: translateY(0px);
}

@media screen and (min-width: 1024px) {
    .emote {
        display: inline-block;
        height: 25px;
        width: auto;
        transform: translateY(0px);
    }
}

.chat {
    /* scroll-behavior: smooth; */
}

.showLoading {
    /* animation: showlg 0.25s ease-in-out; */
}

@keyframes showlg {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes showBg {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>