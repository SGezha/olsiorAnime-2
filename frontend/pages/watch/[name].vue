<script setup>
const config = useRuntimeConfig()
const router = useRouter()
const { findOne, find } = useStrapi4()
const { pending, data: anime } = useAsyncData('anime', () => find('animes', { populate: '*', filters: { url: router.currentRoute._value.params.name } }))
const load = useState(() => false)

</script>

<template>
    <div v-if="!pending" class="">
        <Head>
            <Title>{{ `${anime.data[0].attributes.title.split("/")[0]} - Олсиор смотрит аниме` }}</Title>
            <Meta name="og-title" hid="og-title" property="og:title" :content="anime.data[0].attributes.title" />
            <Meta name="description" hid="description" :content="anime.data[0].attributes.description" />
            <Meta name="og:description" hid="og:description" property="og:description" :content="anime.data[0].attributes.description" />
            <Meta v-if="anime.data[0].attributes.background.data != null" name="og:image" hid="og:image" property="og:image" :content="`${config.public.apiBase}${anime.data[0].attributes.background.data.attributes.url}`" />
        </Head>
        <div v-if="anime.data[0].attributes.background.data != null"
            class="anime-bg w-[100%] showBg absolute top-0 left-0 -z-10">
            <img class="w-full object-cover object-center h-[800px] max-h-[800px]"
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
</template>

<style>
.anime-bg img {
    -webkit-mask-image: linear-gradient(0deg, transparent 0, rgba(0, 0, 0, 1));
    mask-image: linear-gradient(0deg, transparent 0, rgba(0, 0, 0, 1));
}

.showBg {
    animation: showBg 0.25s ease-in-out;
    top: -64px;
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

@keyframes showBg {
    from {
        opacity: 0;
        top: -80px;
    }

    to {
        opacity: 1;
        top: -64px;
    }
}
</style>