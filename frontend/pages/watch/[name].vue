<script setup>
const nuxtApp = useNuxtApp()

const config = useRuntimeConfig()
const router = useRouter()
const { findOne, find } = useStrapi4()
const { pending, data: seoAnime } = await useAsyncData('anime', () => find('animes', { filters: { url: router.currentRoute._value.params.name }, populate: '*' }))
const anime = useState(() => [])
const loadAnime = useState(() => false)
onMounted(async () => {
    anime.value = await find('animes', { filters: { url: router.currentRoute._value.params.name }, populate: '*' })
    loadAnime.value = true
    window.scrollTo({top: 0, behavior: 'smooth'})
})
const page = ref()
const { isFullscreen, enter, exit, toggle } = useFullscreen(page)

onBeforeMount(() => {
    loadAnime.value = false
    anime.value = []
})
</script>

<template>
    <div class="">
        <Head>
            <Title>{{ `${seoAnime.data[0].attributes.title.split("/")[0]} - Олсиор смотрит аниме` }}</Title>
            <Meta name="og-title" hid="og-title" property="og:title" :content="seoAnime.data[0].attributes.title" />
            <Meta name="description" hid="description" :content="seoAnime.data[0].attributes.description" />
            <Meta name="og:description" hid="og:description" property="og:description"
                :content="seoAnime.data[0].attributes.description" />
            <Meta v-if="seoAnime.data[0].attributes.background.data != null" name="og:image" hid="og:image"
                property="og:image"
                :content="`${config.public.apiBase}${seoAnime.data[0].attributes.background.data.attributes.url}`" />
        </Head>
        <div v-if="!pending && loadAnime" ref="page" class="">
            <div v-if="anime.data[0].attributes.background.data != null"
                class="anime-bg w-[100%] showBg absolute top-0 left-0 -z-10">
                <img class="w-full object-cover object-center h-[800px] max-h-[800px] bg-base-100"
                    :src="`${config.public.apiBase}${anime.data[0].attributes.background.data.attributes.url}`" alt="">
            </div>
            <div class="max-w-[1350px] mx-auto px-[10px] pb-[50px] md:py-[20px] min-h-screen">
                <div class="flex flex-col pt-[30px] gap-[30px] md:gap-[50px] md:flex-row">
                    <div class="w-full md:w-[300px] md:min-w-[300px]">
                        <div class="block mb-[20px] md:hidden">
                            <WatchTitle :anime="anime.data[0]" />
                        </div>
                        <img
                            class="object-contain rounded-md w-full shadow-lg bg-base-100 min-h-[400px] max-h-[300px] md:max-h-[400px]"
                            :src="`${config.public.apiBase}${anime.data[0].attributes.poster.data.attributes.url}`"
                            alt="">

                        <WatchAnimeInfo :anime="anime.data[0]" />
                    </div>

                    <div class="relative w-full">
                        <div class="hidden md:block">
                            <WatchTitle :anime="anime.data[0]" />
                        </div>

                        <WatchPlayer v-if="loadAnime" :anime="anime.data[0]" />

                        <WatchDesc v-if="!isFullscreen" :anime="anime.data[0]" />

                        <WatchInfo v-if="!isFullscreen" :anime="anime.data[0]" />

                        <WatchBugReport />

                        <WatchComents v-if="!isFullscreen" :url="router.currentRoute._value.params.name" />
                    </div>
                </div>
            </div>
        </div>
        <WatchSkeleton v-if="!loadAnime" />
        <MyFooter />
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