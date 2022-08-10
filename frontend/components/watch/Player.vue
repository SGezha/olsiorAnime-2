<script setup>
import { useMediaControls } from '@vueuse/core'
import Hls from "hls.js"
const config = useRuntimeConfig()
const props = defineProps({
    anime: {
        type: Object,
        default: () => {}
    }
})
const current = useState(() => 0)
const video = ref(null)
const player = ref(null)
const loop = useState(() => false)
const controls = useMediaControls(video)
const { x, y, isOutside } = useMouseInElement(player)
const { idle, lastActive } = useIdle(20 * 60)
const chat = useState(() => [])
const {
    playing,
    buffered,
    currentTime,
    duration,
    tracks,
    waiting,
    selectedTrack,
    volume,
    muted,
    isPictureInPicture,
    supportsPictureInPicture,
    togglePictureInPicture,
    enableTrack,
    disableTrack,
} = controls
onMounted(() => {
    const hls = new Hls()
    window.hls = hls
    if (props.anime != null) {
        if (Hls.isSupported()) {
            hls.loadSource(props.anime.attributes.episodes[current.value].hls)
            hls.attachMedia(document.querySelector('video'))
            if(props.anime.attributes.episodes[current.value].chat) getChat()
        } else {
            video.value.src = props.anime.attributes.episodes[current.value].hls
        }
    }
})

const { isFullscreen, enter, exit, toggle } = useFullscreen(player)
const changeEpisode = (id) => {
    current.value = id
    if (props.anime != null) {
        if (Hls.isSupported()) {
            hls.loadSource(props.anime.attributes.episodes[current.value].hls)
            hls.attachMedia(document.querySelector('video'))
            document.querySelector('video').play()
            if(props.anime.attributes.episodes[current.value].chat) getChat()
        } else {
            video.value.src = props.anime.attributes.episodes[current.value].hls
        }
    }
}

const endBuffer = computed(() => buffered.value.length > 0 ? buffered.value[buffered.value.length - 1][1] : 0)
const formatDuration = (seconds) => new Date(1000 * seconds).toISOString().slice(14, 19)


const nowChat = useState(() => [])
watch(currentTime, (val) => {
    let now = parseInt(val)
    if(props.anime.attributes.episodes[current.value].chat) {
        nowChat.value = chat.value.filter(a => a.time.timesec < now)
        let chatSize = document.querySelector('.chat').scrollHeight
        document.querySelector('.chat').scrollTo({
            top: chatSize
        })
    }
})

const getChat = async () => {
    fetch('https://cdn.glitch.global/513930f1-8551-4a01-b9f0-59a88e2429c1/emotes.json?v=1644150481352')
        .then(res => res.json())
        .then(async emotes => {
            let response = await fetch(props.anime.attributes.episodes[current.value].chat)
            let chatText = await response.text()
            emotes.forEach(m => {
                chatText = chatText.split(`${m.name}`).join(`<img class="emote" src="${m.url}">`)
            })
            let timeStart;
            chatText.split("\r\n").forEach((text, ind) => {
                if (ind == 0) {
                    timeStart = new Date(
                        `Mon Jan 01 2007 ${text.split(`[`)[1].split(":")[0]}:${text.split(`:`)[1].split(":")[0]
                        }:${text.split(`:`)[2].split("]")[0]} GMT+0530`
                    ).getTime()
                    return
                }
                if (text == "") return
                let timeEnd = new Date(
                    `Mon Jan 01 2007 ${text.split(`[`)[1].split(":")[0]}:${text.split(`:`)[1].split(":")[0]
                    }:${text.split(`:`)[2].split("]")[0]} GMT+0530`
                ).getTime()
                let hourDiff = timeEnd - timeStart
                let secDiff = hourDiff / 1000
                let result = {};
                let message = text.split("] ")[1].split(`${text.split("] ")[1].split(":")[0]}: `).join("")
                let author = text.split("] ")[1].split(":")[0]
                result.time = formatTime(secDiff)
                result.timesec = secDiff
                chat.value.push({
                    time: result,
                    author: text.split("] ")[1].split(":")[0],
                    color: getRandomColor(),
                    text: text
                        .split("] ")[1]
                        .split(`${text.split("] ")[1].split(":")[0]}: `)
                        .join("")
                })
            })
        })
}

const getRandomColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const formatTime = (duration) => {
    let hrs = ~~(duration / 3600);
    let mins = ~~((duration % 3600) / 60);
    let secs = ~~duration % 60;
    let ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
</script>

<template>
    <div class="mt-[10px]">
        <div class="outline-none relative" :class="{ 'h-screen w-screen': isFullscreen }" :tabindex="0" autofocus
            @keydown.prevent.space="playing = !playing" @keydown.right="currentTime += 10"
            @keydown.left="currentTime -= 10" ref="player">
            <div class="relative bg-black rounded-md shadow overflow-hidden  flex items-center"
                :class="{ 'h-screen w-screen rounded-none': isFullscreen, 'h-[50vh] min-h-[50vh] w-100 max-h-[50vh]': !isFullscreen }">

                <div class="w-full flex h-full relative">
                    <video ref="video" crossorigin="anonymous" class="block h-100 w-[100%]"
                        :class="{ 'min-w-[70%]': !anime.attributes.episodes[current].chat == undefined }"
                        :loop="loop" @click="playing = !playing" />
                    <div v-if="anime.attributes.episodes[current].chat != undefined"
                        class="chat w-[30%] p-[10px] overflow-y-auto overflow-x-hidden flex flex-col relative right-0">
                        <div v-for="msg in nowChat" :key="msg" class="block w-100">
                            <span class="font-bold" :style="{ color: msg.color }">{{ msg.author }}</span>:
                            <span v-html="msg.text"></span>
                        </div>
                    </div>
                </div>

                <div v-if="waiting"
                    class="absolute inset-0 grid place-items-center pointer-events-none bg-black bg-opacity-20">
                    <VideoSpinner />
                </div>

                <div class="absolute bottom-0 bg-base-200 bg-opacity-50 video-menu w-[100%] p-[20px] min-w-100 h-[106px] transition-transform"
                    :class="{ 'translate-y-[106px]': isOutside || idle }">
                    <VideoScrubber v-model="currentTime" :max="duration" :secondary="endBuffer">
                        <template #default="{ position, pendingValue }">
                            <div class="absolute transform -translate-x-1/2 bg-black rounded px-2 bottom-0 mb-4 py-1 text-xs text-white"
                                :style="{ left: position }">
                                {{ formatDuration(pendingValue) }}
                            </div>
                        </template>
                    </VideoScrubber>

                    <div class="grid grid-cols-5 md:flex md:items-center mt-[10px] gap-[10px]">
                        <button class="btn videoBtn" @click="playing = !playing">
                            <svg v-if="!playing" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                class="iconify iconify--ic" width="32" height="32" preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z">
                                </path>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true" role="img" class="iconify iconify--ic" width="32" height="32"
                                preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z">
                                </path>
                            </svg>
                        </button>
                        <button class="btn videoBtn" @click="muted = !muted">
                            <svg v-if="muted" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                class="iconify iconify--ic" width="32" height="32" preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7L7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91c-.36.15-.58.53-.58.92c0 .72.73 1.18 1.39.91c.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 1 0 1.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87c0-3.83-2.4-7.11-5.78-8.4c-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z">
                                </path>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true" role="img" class="iconify iconify--ic" width="32" height="32"
                                preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z">
                                </path>
                            </svg>
                        </button>
                        <VideoScrubber v-model="volume" :max="1" class="w-32 ml-2 hidden md:flex" />
                        <div class="flex-col flex-1 text-sm ml-2 hidden md:flex">
                            {{ formatDuration(currentTime) }} / {{ formatDuration(duration) }}
                        </div>

                        <VideoMenu class="flex">
                            <template #default="{ open }">
                                <button class="btn videoBtn" @click="open()">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true" role="img" class="iconify iconify--ic" width="24" height="24"
                                        preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z">
                                        </path>
                                    </svg>
                                </button>
                            </template>
                            <template #menu="{ close }">
                                <div
                                    class="absolute bottom-[60px] -right-[30px] md:right-0 shadow-xl p-3 bg-neutral flex flex-col gap-[10px] rounded">
                                    <VideoMenuItem v-if="supportsPictureInPicture"
                                        @click="() => { togglePictureInPicture(); close(); }">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M28 4H10a2.006 2.006 0 0 0-2 2v14a2.006 2.006 0 0 0 2 2h18a2.006 2.006 0 0 0 2-2V6a2.006 2.006 0 0 0-2-2Zm0 16H10V6h18Z">
                                            </path>
                                            <path fill="currentColor"
                                                d="M18 26H4V16h2v-2H4a2.006 2.006 0 0 0-2 2v10a2.006 2.006 0 0 0 2 2h14a2.006 2.006 0 0 0 2-2v-2h-2Z">
                                            </path>
                                        </svg>
                                        <span>{{ $t('pip') }}</span>
                                    </VideoMenuItem>
                                    <VideoMenuItem>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="none"
                                                d="M11 23a1 1 0 0 1-1-1V10a1 1 0 0 1 1.447-.894l12 6a1 1 0 0 1 0 1.788l-12 6A1.001 1.001 0 0 1 11 23Z">
                                            </path>
                                            <path fill="currentColor"
                                                d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm7.447 14.895l-12 6A1 1 0 0 1 10 22V10a1 1 0 0 1 1.447-.894l12 6a1 1 0 0 1 0 1.788Z">
                                            </path>
                                        </svg>
                                        <span>{{ $t('autonext') }}</span>
                                    </VideoMenuItem>
                                    <VideoMenuItem>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M17.74 30L16 29l4-7h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.84Z">
                                            </path>
                                            <path fill="currentColor" d="M8 10h16v2H8zm0 6h10v2H8z">
                                            </path>
                                        </svg>
                                        <span>{{ $t('chat') }}</span>
                                    </VideoMenuItem>
                                </div>
                            </template>
                        </VideoMenu>
                        <VideoMenu>
                            <template #default="{ open }">
                                <button class="btn videoBtn" @click="open()">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true" role="img" class="iconify iconify--carbon" width="32"
                                        height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                        <path fill="currentColor"
                                            d="M26 16a9.928 9.928 0 0 0-1.14-4.618l-1.495 1.496A7.948 7.948 0 0 1 24 16zm-2.586-6L22 8.586L17.285 13.3A2.966 2.966 0 0 0 16 13a3 3 0 1 0 3 3a2.966 2.966 0 0 0-.3-1.285zM16 17a1 1 0 1 1 1-1a1.001 1.001 0 0 1-1 1zm0-9a7.952 7.952 0 0 1 3.122.635l1.496-1.496A9.986 9.986 0 0 0 6 16h2a8.01 8.01 0 0 1 8-8z">
                                        </path>
                                        <path fill="currentColor"
                                            d="M16 30a14 14 0 1 1 14-14a14.016 14.016 0 0 1-14 14Zm0-26a12 12 0 1 0 12 12A12.014 12.014 0 0 0 16 4Z">
                                        </path>
                                    </svg>
                                </button>
                            </template>
                            <template #menu="{ close }">
                                <div
                                    class="absolute bottom-[60px] right-0 shadow-xl p-3 bg-neutral w-[200px] grid grid-cols-2 gap-[10px] rounded">
                                    <VideoMenuItem :class="{ 'bg-primary': controls.rate.value == 3 }"
                                        @click="() => { controls.rate.value = 3; close(); }">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M30 20a13.854 13.854 0 0 0-2.23-7.529l-1.444 1.445A11.892 11.892 0 0 1 28 20zM28 9.414L26.586 8l-8.567 8.567A3.952 3.952 0 0 0 16 16a4 4 0 1 0 4 4a3.953 3.953 0 0 0-.567-2.02zM16 22a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2zm0-14a11.909 11.909 0 0 1 6.083 1.674l1.454-1.453A13.977 13.977 0 0 0 2 20h2A12.014 12.014 0 0 1 16 8z">
                                            </path>
                                        </svg>
                                        3x
                                    </VideoMenuItem>
                                    <VideoMenuItem :class="{ 'bg-primary': controls.rate.value == 2 }"
                                        @click="() => { controls.rate.value = 2; close(); }">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M30 20a13.854 13.854 0 0 0-2.23-7.529l-1.444 1.445A11.892 11.892 0 0 1 28 20zM28 9.414L26.586 8l-8.567 8.567A3.952 3.952 0 0 0 16 16a4 4 0 1 0 4 4a3.953 3.953 0 0 0-.567-2.02zM16 22a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2zm0-14a11.909 11.909 0 0 1 6.083 1.674l1.454-1.453A13.977 13.977 0 0 0 2 20h2A12.014 12.014 0 0 1 16 8z">
                                            </path>
                                        </svg>
                                        2x
                                    </VideoMenuItem>
                                    <VideoMenuItem :class="{ 'bg-primary': controls.rate.value == 1.75 }"
                                        @click="() => { controls.rate.value = 1.75; close(); }">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M30 20a13.854 13.854 0 0 0-2.23-7.529l-1.444 1.445A11.892 11.892 0 0 1 28 20zM28 9.414L26.586 8l-8.567 8.567A3.952 3.952 0 0 0 16 16a4 4 0 1 0 4 4a3.953 3.953 0 0 0-.567-2.02zM16 22a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2zm0-14a11.909 11.909 0 0 1 6.083 1.674l1.454-1.453A13.977 13.977 0 0 0 2 20h2A12.014 12.014 0 0 1 16 8z">
                                            </path>
                                        </svg>
                                        1.75x
                                    </VideoMenuItem>
                                    <VideoMenuItem :class="{ 'bg-primary': controls.rate.value == 1.5 }"
                                        @click="() => { controls.rate.value = 1.5; close(); }">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M30 20a13.854 13.854 0 0 0-2.23-7.529l-1.444 1.445A11.892 11.892 0 0 1 28 20zM28 9.414L26.586 8l-8.567 8.567A3.952 3.952 0 0 0 16 16a4 4 0 1 0 4 4a3.953 3.953 0 0 0-.567-2.02zM16 22a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2zm0-14a11.909 11.909 0 0 1 6.083 1.674l1.454-1.453A13.977 13.977 0 0 0 2 20h2A12.014 12.014 0 0 1 16 8z">
                                            </path>
                                        </svg>
                                        1.5x
                                    </VideoMenuItem>
                                    <VideoMenuItem :class="{ 'bg-primary': controls.rate.value == 1.25 }"
                                        @click="() => { controls.rate.value = 1.25; close(); }">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M30 20a13.854 13.854 0 0 0-2.23-7.529l-1.444 1.445A11.892 11.892 0 0 1 28 20zM28 9.414L26.586 8l-8.567 8.567A3.952 3.952 0 0 0 16 16a4 4 0 1 0 4 4a3.953 3.953 0 0 0-.567-2.02zM16 22a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2zm0-14a11.909 11.909 0 0 1 6.083 1.674l1.454-1.453A13.977 13.977 0 0 0 2 20h2A12.014 12.014 0 0 1 16 8z">
                                            </path>
                                        </svg>
                                        1.25x
                                    </VideoMenuItem>
                                    <VideoMenuItem :class="{ 'bg-primary': controls.rate.value == 1 }"
                                        @click="() => { controls.rate.value = 1; close(); }">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M30 20a13.854 13.854 0 0 0-2.23-7.529l-1.444 1.445A11.892 11.892 0 0 1 28 20zM28 9.414L26.586 8l-8.567 8.567A3.952 3.952 0 0 0 16 16a4 4 0 1 0 4 4a3.953 3.953 0 0 0-.567-2.02zM16 22a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2zm0-14a11.909 11.909 0 0 1 6.083 1.674l1.454-1.453A13.977 13.977 0 0 0 2 20h2A12.014 12.014 0 0 1 16 8z">
                                            </path>
                                        </svg>
                                        1x
                                    </VideoMenuItem>
                                    <VideoMenuItem :class="{ 'bg-primary': controls.rate.value == 0.75 }"
                                        @click="() => { controls.rate.value = 0.75; close(); }">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M30 20a13.854 13.854 0 0 0-2.23-7.529l-1.444 1.445A11.892 11.892 0 0 1 28 20zM28 9.414L26.586 8l-8.567 8.567A3.952 3.952 0 0 0 16 16a4 4 0 1 0 4 4a3.953 3.953 0 0 0-.567-2.02zM16 22a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2zm0-14a11.909 11.909 0 0 1 6.083 1.674l1.454-1.453A13.977 13.977 0 0 0 2 20h2A12.014 12.014 0 0 1 16 8z">
                                            </path>
                                        </svg>
                                        0.75x
                                    </VideoMenuItem>
                                    <VideoMenuItem :class="{ 'bg-primary': controls.rate.value == 0.5 }"
                                        @click="() => { controls.rate.value = 0.5; close(); }">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--carbon" width="32" height="32"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                            <path fill="currentColor"
                                                d="M30 20a13.854 13.854 0 0 0-2.23-7.529l-1.444 1.445A11.892 11.892 0 0 1 28 20zM28 9.414L26.586 8l-8.567 8.567A3.952 3.952 0 0 0 16 16a4 4 0 1 0 4 4a3.953 3.953 0 0 0-.567-2.02zM16 22a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2zm0-14a11.909 11.909 0 0 1 6.083 1.674l1.454-1.453A13.977 13.977 0 0 0 2 20h2A12.014 12.014 0 0 1 16 8z">
                                            </path>
                                        </svg>
                                        0.5x
                                    </VideoMenuItem>
                                </div>
                            </template>
                        </VideoMenu>
                        <button class="btn videoBtn" @click="toggle(); isFullscreen ? screen.orientation.lock('landscape-primary') : screen.orientation.lock('portrait')">
                            <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                class="iconify iconify--carbon" width="32" height="32"
                                preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                    d="M20 2v2h6.586L18 12.582L19.414 14L28 5.414V12h2V2H20zm-6 17.416L12.592 18L4 26.586V20H2v10h10v-2H5.414L14 19.416z">
                                </path>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true" role="img" class="iconify iconify--carbon" width="32" height="32"
                                preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                    d="M4 18v2h6.586L2 28.582L3.414 30L12 21.414V28h2V18H4zM30 3.416L28.592 2L20 10.586V4h-2v10h10v-2h-6.586L30 3.416z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="mt-[30px]">
        <div class="font-bold text-2xl">{{ $t('online') }}</div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-[10px] w-full gap-[10px]">
            <button v-for="(ep, ind) in anime.attributes.episodes" :key="ep.title" class="btn"
                :class="{ 'active': current == ind }" @click="changeEpisode(ind)" :title="ep.title">
                <div class="overflow-hidden text-left text-ellipsis whitespace-nowrap">
                    {{ ep.title }}
                </div>
            </button>
        </div>
    </div>
</template>