<script setup>
const twName = useCookie('tw_login')
const router = useRouter()
const config = useRuntimeConfig()
const load = useState(() => false)
const { find, create, delete: _delete } = useStrapi4()
const inputUrl = useState(() => '')
const isOpen = useState(() => false)
const userBg = useState(() => '/343502.png')
const { data: profiles, pending, error, refresh } = await useAsyncData(
    'profiles',
    () => $fetch(`https://smotrel.net/server-api/getprofile?name=${router.currentRoute._value.params.name}`)
)

const { data: comments } = await useAsyncData(
    'comments',
    () => find('comments', { populate: '*', pagination: { pageSize: 100 }, sort: 'createdAt:desc', filters: { author: router.currentRoute._value.params.name } })
)

const { data: animes } = await useAsyncData(
    'animes',
    () => find('animes', { populate: '*', pagination: { pageSize: 100 } })
)

const { data: user } = await useAsyncData(
    'user',
    () => find('profiles', { populate: "*", filters: { name: router.currentRoute._value.params.name } })
)

const saveBg = async () => {
    find('profiles', {
        populate: "*", filters: { name: router.currentRoute._value.params.name }
    }).then(res => {
        if (res.data.length == 0) {
            create('profiles', {
                name: router.currentRoute._value.params.name,
                bg: inputUrl.value
            }).then(() => {
                window.location = '/profile/' + router.currentRoute._value.params.name
            })
        } else {
            _delete('profiles', res.data[0].id).then(() => {
                create('profiles', {
                    name: router.currentRoute._value.params.name,
                    bg: inputUrl.value
                }).then(() => {
                    window.location = '/profile/' + router.currentRoute._value.params.name
                })
            })
        }
    })
}

</script>

<template>
    <div class="min-h-screen">

        <Head>
            <Meta name="og:url" hid="og:url" property="og:url" :content="`https://smotrel.net`" />
            <Title>{{ `${router.currentRoute._value.params.name} - Олсиор смотрит аниме` }}</Title>
            <Meta name="og-title" hid="og-title" property="og:title"
                :content="`${router.currentRoute._value.params.name} - Олсиор смотрит аниме`" />
            <Meta name="description" hid="description"
                content="Сайт с записями стримов просмотра аниме Olsior'а! С удобным интерфейсом и крутыми фишками. Сохранение прогресса просмотра, запись чата." />
            <Meta name="og:description" hid="og:description" property="og:description"
                content="Сайт с записями стримов просмотра аниме Olsior'а! С удобным интерфейсом и крутыми фишками. Сохранение прогресса просмотра, запись чата." />
            <Meta name="og:image" hid="og:image" v-if="comments.data[0]" property="og:image"
                :content="comments.data[0].attributes.img" />
        </Head>
        <MyDonate />

        <div v-if="!pending && comments.data != null && profiles.place != -1" ref="page" class="">
            <div class="anime-bg w-[100%] showBg absolute top-0 left-0 -z-10">
                <img loading="lazy" class="w-full object-cover object-center h-[800px] max-h-[800px]"
                    :src="user.data[0] != null ? user.data[0].attributes.bg : userBg" alt="">
            </div>
            <div class="max-w-[1350px] mx-auto px-[10px] pb-[20px]">
                <div class="flex">
                    <img v-if="comments.data[0]" class="w-[182px] h-[182px] bg-neutral rounded-md mr-[20px]"
                        :src="comments.data[0].attributes.img" alt="">
                    <div class=" text-lg">
                        <div class="text-[40px] font-bold">
                            {{ router.currentRoute._value.params.name }}
                            <div v-if="twName == router.currentRoute._value.params.name" @click="isOpen = true"
                                for="my-modal-bg"
                                class="inline-block static text-neutral-content cursor-pointer bg-neutral p-[5px] rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    aria-hidden="true" role="img" class="iconify iconify--material-symbols" width="25"
                                    height="25" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M4 22V2h10l6 6v4h-2V9h-5V4H6v16h6v2Zm2-2V4v16Zm12.275-5.45l1.075 1.05l-3.85 3.85v1.05h1.05l3.85-3.85l1.075 1.05l-4.3 4.3H14v-3.175Zm3.2 3.15l-3.2-3.15l2.15-2.15l3.175 3.175Z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-[10px]">
                            {{ $t('allmsg') }}: {{ profiles.data[0].countMsg }}
                        </div>
                        <div class="">
                            {{ $t('place') }}: <a class="link"
                                :href="`/rating?page=${parseInt(profiles.place / 50) + 1}`">№{{ profiles.place + 1
                                }}</a>
                        </div>
                    </div>
                </div>
                <div tabindex="0" class="collapse collapse-arrow bg-neutral rounded-box mt-[15px]">
                    <div class="collapse-title text-xl font-medium text-neutral-content">
                        {{ $t('animecom') }}:
                    </div>
                    <div class="collapse-content">
                        <div v-if="animes != null" class="flex flex-col gap-[10px]">
                            <div class="flex w-full bg-base-300 rounded-md p-[20px] relative h-[300px]"
                                v-for="an in profiles.data[0].animes">
                                <div class="h-full relative">
                                    <img class="h-full w-[200px] rounded-md object-cover"
                                        :src="`${config.public.apiBase}${animes.data.find(a => a.id == an.anime).attributes.poster.data.attributes.url}`"
                                        alt="">
                                </div>
                                <div class="h-full ml-[10px] w-full overflow-y-auto">
                                    <div v-for="msg in an.msgs" class="w-full">
                                        <span class="text-primary">{{ router.currentRoute._value.params.name
                                        }}</span>({{ msg.episode }}): {{ msg.text }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="isOpen" class="fixed left-0 top-0 w-full flex justify-center items-center z-50 "
                    style="height: calc(100vh - calc(100vh - 100%))">
                    <div @click="isOpen = false"
                        class="cursor-pointer absolute left-0 top-0 w-full h-full bg-black bg-opacity-50 z-10"></div>
                    <div class="form-control max-w-[600px] bg-neutral p-[20px] rounded-md z-20">
                        <label class="label">
                            <span class="label-text">{{ $t('bgurl') }}:</span>
                        </label>
                        <label class="input-group">
                            <input v-model="inputUrl" type="text" placeholder="https://site.com/img.jpg"
                                class="input input-primary input-bordered w-full" />
                            <button @click="saveBg" class="btn btn-primary">{{ $t('savebg') }}</button>
                        </label>
                    </div>
                </div>

                <div v-if="comments != null && animes != null" class="mt-[15px] flex flex-col gap-[10px]">
                    <div v-for="com in comments.data" class="bg-neutral px-[20px] py-[20px] rounded-md relative">
                        <div class="flex justify-between items-center">
                            <a :href="`/watch/${com.attributes.url}`" class="flex items-center">
                                <div class="bg-neutral-content w-[40px] h-[40px] rounded-md mr-[10px]">
                                    <img class="w-full h-full object-cover"
                                        :src="`${config.public.apiBase}${animes.data.find(a => a.attributes.url == com.attributes.url).attributes.poster.data.attributes.url}`"
                                        alt="">
                                </div>
                                <div class="text-lg font-bold text-neutral-content">{{ animes.data.find(a =>
                                        a.attributes.url == com.attributes.url).attributes.title
                                }}</div>
                            </a>
                            <div class="text-neutral-content">
                                {{ new Date(com.attributes.createdAt).toLocaleDateString() }}
                                {{ new Date(com.attributes.createdAt).toLocaleTimeString() }}
                            </div>
                        </div>
                        <div class="pt-[10px] text-neutral-content block w-[90%] break-words">
                            {{ com.attributes.msg }}
                        </div>
                        <button v-if="com.attributes.author == twName" @click="deleteCom(com.id)"
                            class="absolute w-[30px] h-[30px] p-[5px] bg-error flex items-center justify-center rounded-full text-white right-[20px] bottom-[20px]">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true" role="img" class="iconify iconify--mdi"
                                preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
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