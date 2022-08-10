<script setup>
const config = useRuntimeConfig()
const router = useRouter()
const { findOne, find } = useStrapi4()
const { pending, data: anime } = useAsyncData('anime', () => find('animes', { populate: '*', filters: { url: router.currentRoute._value.params.name } }))
const load = useState(() => false)
</script>

<template>
    <div v-if="!pending" class="">
        <div v-if="anime.data[0].attributes.background.data != null"
            class="anime-bg w-[99vw] showBg absolute left-0 -z-10">
            <img class="w-full object-cover object-center h-[612px] max-h-[612px]"
                :src="`${config.public.apiBase}${anime.data[0].attributes.background.data.attributes.url}`" alt="">
        </div>
        <div class="max-w-[1350px] mx-auto px-[10px] py-[20px] min-h-screen">
            <div class="flex flex-col pt-[30px] gap-[30px] md:gap-[50px] md:flex-row">
                <div class="w-full md:w-[300px] md:min-w-[300px]">
                    <img class="object-cover rounded-md w-full showAnimation"
                        :src="`${config.public.apiBase}${anime.data[0].attributes.poster.data.attributes.url}`" alt="">
                </div>

                <div class="relative w-full showAnimation">
                    <WatchTitle :anime="anime.data[0]" />

                    <WatchPlayer :anime="anime.data[0]" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.anime-bg img {
    -webkit-mask-image: linear-gradient(0deg, transparent 0, hsla(var(--p) / 1));
    mask-image: linear-gradient(0deg, transparent 0, hsla(var(--p) /1));
}

.showBg {
    animation: showBg 0.5s ease-in-out;
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
    backdrop-filter: blur(10px);
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