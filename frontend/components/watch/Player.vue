<script setup>
import Hls from 'hls.js'
import { useStorage } from '@vueuse/core'
const { update, find, create, findOne } = useStrapi4()
const router = useRouter()
const config = useRuntimeConfig()
const props = defineProps({
    anime: {
        type: Object,
        default: () => { }
    }
})
const saved = useCookie()
const current = useState(() => 0)
const video = ref(null)
const player = ref(null)
const loop = useState(() => false)
const controls = useMediaControls(video)
const { x, y, isOutside } = useMouseInElement(player)
const { idle, lastActive } = useIdle(20 * 60)
const chat = useState(() => [])
const chatShow = useState(() => true)
const chatSize = useState(() => 30)
const heroku = useState(() => false)
const markCreateModal = useState(() => false)
const timeMarkLoaded = useState(() => false)
const { isFullscreen, enter, exit, toggle } = useFullscreen(player)
const { isSupported, orientation, angle, lockOrientation, unlockOrientation } = useScreenOrientation()
const markTitle = useState(() => '')
const twName = useCookie('tw_login')
const { playing, buffered, currentTime, duration, tracks, waiting, selectedTrack, volume, muted, isPictureInPicture, supportsPictureInPicture, togglePictureInPicture, enableTrack, disableTrack, } = controls

onMounted(() => {
    const hls = new Hls()
    window.hls = hls
    let saved = JSON.parse(localStorage.getItem(router.currentRoute._value.params.name))
    if (props.anime != null) {
        if (Hls.isSupported()) {
            hls.loadSource(props.anime.attributes.episodes[current.value].hls)
            hls.attachMedia(document.querySelector('video'))
            if (props.anime.attributes.episodes[current.value].chat) getChat()
        } else {
            video.value.src = props.anime.attributes.episodes[current.value].hls
        }
        if (saved) {
            changeEpisode(saved.ep, false)
            volume.value = saved.volume
            currentTime.value = saved.time
        }
    }
})

const changeEpisode = (id, autoplay, videoTime) => {
    current.value = id
    video.value.src = ''
    window.hls.stopLoad()
    window.hls.destroy()
    timeMarkLoaded.value = false
    if (props.anime != null) {
        if (heroku.value) {
            video.value.src = props.anime.attributes.episodes[current.value].heroku
            document.querySelector('video').onloadeddata = () => {
                if (videoTime) document.querySelector('video').currentTime = videoTime
                if (autoplay) document.querySelector('video').play()
            }
        } else {
            const hls = new Hls()
            if (Hls.isSupported()) {
                hls.loadSource(props.anime.attributes.episodes[current.value].hls)
                hls.attachMedia(document.querySelector('video'))
                window.hls = hls
            } else {
                video.value.src = props.anime.attributes.episodes[current.value].hls
            }
            if (autoplay) {
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    if (videoTime) document.querySelector('video').currentTime = videoTime
                    document.querySelector('video').play() 
                })
            }
        }
        if (props.anime.attributes.episodes[current.value].chat) {
            getChat()
        } else {
            chatShow.value = false
        }
    }
}

const endBuffer = computed(() => buffered.value.length > 0 ? buffered.value[buffered.value.length - 1][1] : 0)
const formatDuration = (seconds) => new Date(1000 * seconds).toISOString().slice(12, 19)

const nowChat = useState(() => [])

watch(currentTime, (val) => {
    let now = parseInt(val)
    if (now > 30) localStorage.setItem(router.currentRoute._value.params.name, JSON.stringify({
        ep: current.value,
        volume: volume.value,
        time: parseInt(currentTime.value)
    }))
    if (props.anime.attributes.episodes[current.value].chat && chatShow) {
        let temp = chat.value.filter(a => a.time.timesec < now)
        nowChat.value = temp
        setTimeout(() => {
            if (chatShow && document.querySelector('.chat')) document.querySelector('.chat').scrollTo({ top: document.querySelector('.chat').scrollHeight })
        }, 50)
    }
})

const openLink = (url) => {
    window.open(url, '_blank').focus()
}

const getChat = async () => {
    chat.value = []
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

const scruWidth = ref(null)
const { width: timeMarksWidth } = useElementBounding(scruWidth)
const timeMarkPosition = () => {
    document.querySelector('.video-menu').style.width = "100.1%"
    let timeMarks = document.querySelectorAll('.timeMark')
    timeMarks.forEach(m => {
        let left = calcMarkLeft(m.dataset.duration, m.dataset.time)
        m.style.left = `calc(${left}% - ${m.offsetWidth / 2}px)`
    })
    timeMarkLoaded.value = true
    setTimeout(() => {
        document.querySelector('.video-menu').style.width = "100%"
    }, 100)
}

const createMark = () => {
    create('time-marks', { anime: props.anime.id, time: formatDuration(currentTime.value), author: twName.value, title: markTitle.value, epId: current.value }).then(async () => {
        findOne('animes', props.anime.id, { filters: { url: router.currentRoute._value.params.name }, populate: '*' }).then((res) => {
            props.anime.attributes.timemarks = res.data.attributes.timemarks
            setTimeout(() => {
                timeMarkPosition()
            }, 100)
        })
        markCreateModal.value = false
    })
}

const calcMarkLeft = (videoDuration, markTime) => {
    let markSec = markTime.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)
    let leftMark = percentage(markSec, videoDuration)
    return leftMark
}

const percentage = (partialValue, totalValue) => {
    return (100 * partialValue) / totalValue;
}

const formatTime = (duration) => {
    let hrs = ~~(duration / 3600)
    let mins = ~~((duration % 3600) / 60)
    let secs = ~~duration % 60
    let ret = ""
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "")
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "")
    ret += "" + secs
    return ret
}

watch(isFullscreen, (val) => {
    if (val) {
        document.querySelector('body').style.overflow = 'hidden'
    } else {
        document.querySelector('body').style.overflow = null
    }
})

const toggleFullScreen = () => {
    if (!isFullscreen.value) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        lockOrientation('landscape-primary')
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        lockOrientation('portrait-primary')
        unlockOrientation()
    }
}

</script>

<template>
    <div v-if="anime.attributes">
        <div class="mt-[10px] transition" :class="{ 'fixed left-0 top-0 mt-0 z-99 transition-all': isFullscreen }">
            <div class="outline-none relative" :class="{ 'h-screen w-screen': isFullscreen }" :tabindex="0" autofocus
                @keydown.right="currentTime += 5" @keydown.left="currentTime -= 5" @keydown.f="toggleFullScreen" @keydown.а="toggleFullScreen"
                @keydown.m="muted = !muted" @keydown.м="muted = !muted" ref="player">
                <div class="relative bg-black rounded-md shadow overflow-hidden  flex items-center"
                    :class="{ ' h-screen w-screen rounded-none': isFullscreen, 'h-[50vh] min-h-[50vh] w-100 max-h-[50vh]': !isFullscreen }">

                    <div class="w-full flex h-full relative">
                        <video @keydown.prevent.space="playing = !playing" ref="video"
                            class="block h-100 transition-all w-[100%]"
                            :class="{ 'min-w-[70%]': !anime.attributes.episodes[current].chat == undefined }"
                            @loadeddata="timeMarkPosition" :loop="loop" @ended="changeEpisode(current + 1, true)"
                            :style="{ width: `${chatShow ? 100 - chatSize : 100}%` }" @click="playing = !playing" />
                        <div v-if="anime.attributes.episodes[current].chat != undefined"
                            class="chat p-[10px] overflow-y-auto overflow-x-hidden flex flex-col relative transition-all right-0"
                            :style="{ width: `${chatShow ? chatSize : 0}%`, display: `${chatShow ? 'flex' : 'none'}` }">
                            <div v-for="msg in nowChat" :key="msg" class="block w-100">
                                <span @click="openLink(`https://smotrel.net/profile/${msg.author}`)" class="font-bold cursor-pointer" :style="{ color: msg.color }">{{ msg.author }}</span>:
                                <span class="text-white" v-html="msg.text"></span>
                            </div>
                        </div>

                        <div v-if="markCreateModal"
                            class="w-[80%] z-50 absolute top-[50%] left-[50%] shadow-lg -translate-x-[50%] -translate-y-[50%] bg-neutral showModal rounded-md overflow-hidden md:w-[50%]">
                            <div class="w-full h-full relative p-[20px] flex flex-col">
                                <div class="flex items-center justify-between">
                                    <div class="text-lg font-bold text-neutral-content">{{ $t('marktitle') }}: </div>
                                    <div class="btn btn-error min-h-0 h-auto btn-circle p-[3px]"
                                        @click="markCreateModal = false">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                            class="iconify iconify--material-symbols" width="20" height="20"
                                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                            <path fill="currentColor"
                                                d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="flex relative flex-col">
                                    <label class="label">
                                        <span class="label-text">{{ $t('markname') }}</span>
                                    </label>
                                    <input type="text" v-model="markTitle" class="input input-bordered w-full" />
                                    <label class="label">
                                        <span class="label-text">{{ $t('marktime') }}</span>
                                    </label>
                                    <input class="input w-full" type="text" disabled
                                        :value="formatDuration(currentTime)">
                                    <button @click="createMark" class="btn w-full mt-[10px] btn-primary">{{ $t('markbtn') }}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="waiting"
                        class="absolute inset-0 grid place-items-center pointer-events-none bg-black bg-opacity-20">
                        <VideoSpinner />
                    </div>

                    <client-only>
                        <div class="absolute video-menu bottom-0 bg-neutral bg-opacity-70 video-menu w-[100%] p-[20px] h-[100px] transition-all"
                            :class="{ 'translate-y-[110px] opacity-0': isOutside || idle, 'pt-[30px] h-[110px]': anime.attributes.timemarks.data.filter(a => a.attributes.epId == current).length > 0 }">

                            <div v-if="anime.attributes.timemarks.data.filter(a => a.attributes.epId == current).length > 0"
                                class="absolute top-[5px] flex w-full text-sm text-neutral-content"
                                :style="{ width: `${timeMarksWidth.toFixed(0)}px` }">
                                <div v-for="(mark, ind) in anime.attributes.timemarks.data.filter(a => a.attributes.epId == current)"
                                    :class="{ 'tooltip-open': timeMarkLoaded }"
                                    class="absolute timeMark tooltip tooltip-primary top-[24px] px-[5px] text-sm text-[rgba(0,0,0,0)] select-none"
                                    :data-tip="mark.attributes.title" :data-duration="duration" :data-time="mark.attributes.time">{{
                                            mark.attributes.title
                                    }}</div>
                            </div>

                            <VideoScrubber v-model="currentTime" ref="scruWidth" :max="duration" :secondary="endBuffer">
                                <template #default="{ position, pendingValue }">
                                    <div class="absolute transform tooltip tooltip-open -translate-x-1/2 tooltip-primary rounded bottom-[9px] px-[5px] text-sm text-white"
                                        :style="{ left: position }" :data-tip="formatDuration(pendingValue)">
                                    </div>
                                </template>
                            </VideoScrubber>

                            <div class="grid grid-cols-4 md:flex md:items-center mt-[10px] gap-[10px]">
                                <button class="btn videoBtn" @click="playing = !playing">
                                    <svg v-if="!playing" xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                        class="iconify iconify--ic" width="32" height="32"
                                        preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z">
                                        </path>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                        class="iconify iconify--ic" width="32" height="32"
                                        preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z">
                                        </path>
                                    </svg>
                                </button>
                                <button class="btn videoBtn" @click="muted = !muted">
                                    <svg v-if="muted" xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                        class="iconify iconify--ic" width="32" height="32"
                                        preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7L7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91c-.36.15-.58.53-.58.92c0 .72.73 1.18 1.39.91c.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 1 0 1.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87c0-3.83-2.4-7.11-5.78-8.4c-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z">
                                        </path>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                        class="iconify iconify--ic" width="32" height="32"
                                        preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z">
                                        </path>
                                    </svg>
                                </button>
                                <VideoScrubber v-model="volume" :max="1" class="w-32 ml-2 hidden md:flex" />
                                <div class="flex-col flex-1 text-sm ml-2 text-neutral-content hidden md:flex">
                                    {{ formatDuration(currentTime) }} / {{ formatDuration(duration) }}
                                </div>

                                <VideoMenu class="flex">
                                    <template #default="{ open }">
                                        <button class="btn videoBtn" @click="open()">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                                class="iconify iconify--ic" width="24" height="24"
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
                                            <VideoMenuItem @click="openLink(anime.attributes.episodes[current].tgLink)">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                                                    role="img" class="iconify iconify--ic" width="24" height="24"
                                                    preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                                    <path fill="currentColor"
                                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38z">
                                                    </path>
                                                </svg>
                                                <span>{{ $t('telegramlink') }}</span>
                                            </VideoMenuItem>
                                            <VideoMenuItem v-if="supportsPictureInPicture"
                                                @click="() => { togglePictureInPicture(); close(); }">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                                                    role="img" class="iconify iconify--carbon" width="24" height="24"
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
                                            <VideoMenuItem v-if="twName" @click="markCreateModal = true; close()">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                                                    role="img" class="iconify iconify--uil" width="24" height="24"
                                                    preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                                    <path fill="currentColor"
                                                        d="M14 9.45h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2Zm6.46.18A8.5 8.5 0 1 0 6 16.46l5.3 5.31a1 1 0 0 0 1.42 0L18 16.46a8.46 8.46 0 0 0 2.46-6.83Zm-3.86 5.42l-4.6 4.6l-4.6-4.6a6.49 6.49 0 0 1-1.87-5.22A6.57 6.57 0 0 1 8.42 5a6.47 6.47 0 0 1 7.16 0a6.57 6.57 0 0 1 2.89 4.81a6.49 6.49 0 0 1-1.87 5.24Z">
                                                    </path>
                                                </svg>
                                                <span>{{ $t('createmarkbtn') }}</span>
                                            </VideoMenuItem>
                                            <VideoMenuItem @click="openLink(anime.attributes.episodes[current].heroku)">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                                                    role="img" class="iconify iconify--ph" width="24" height="24"
                                                    preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256">
                                                    <path fill="currentColor"
                                                        d="M71.5 88.5a12 12 0 0 1 17-17L116 99V24a12 12 0 0 1 24 0v75l27.5-27.5a12 12 0 0 1 17 17l-48 48a12.1 12.1 0 0 1-17 0ZM224 116h-39.4a12 12 0 0 0 0 24H220v56H36v-56h35.4a12 12 0 0 0 0-24H32a20.1 20.1 0 0 0-20 20v64a20.1 20.1 0 0 0 20 20h192a20.1 20.1 0 0 0 20-20v-64a20.1 20.1 0 0 0-20-20Zm-20 52a16 16 0 1 0-16 16a16 16 0 0 0 16-16Z">
                                                    </path>
                                                </svg>
                                                <span>{{ $t('downloadVideo') }}</span>
                                            </VideoMenuItem>
                                            <VideoMenuItem
                                                v-if="anime.attributes.episodes[current].heroku != undefined">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                                                    role="img" class="iconify iconify--bx" width="24" height="24"
                                                    preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                                    <path fill="currentColor"
                                                        d="M20 3H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 9V5h16v4zm16 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM4 19v-4h16v4z">
                                                    </path>
                                                    <path fill="currentColor"
                                                        d="M17 6h2v2h-2zm-3 0h2v2h-2zm3 10h2v2h-2zm-3 0h2v2h-2z"></path>
                                                </svg>
                                                <span>Heroku</span>
                                                <input class="toggle toggle-primary" type="checkbox"
                                                    @change="changeEpisode(current, true, currentTime)"
                                                    v-model="heroku">
                                            </VideoMenuItem>
                                            <VideoMenuItem>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                                                    role="img" class="iconify iconify--carbon" width="24" height="24"
                                                    preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                                    <path fill="currentColor"
                                                        d="M26 16a9.928 9.928 0 0 0-1.14-4.618l-1.495 1.496A7.948 7.948 0 0 1 24 16zm-2.586-6L22 8.586L17.285 13.3A2.966 2.966 0 0 0 16 13a3 3 0 1 0 3 3a2.966 2.966 0 0 0-.3-1.285zM16 17a1 1 0 1 1 1-1a1.001 1.001 0 0 1-1 1zm0-9a7.952 7.952 0 0 1 3.122.635l1.496-1.496A9.986 9.986 0 0 0 6 16h2a8.01 8.01 0 0 1 8-8z">
                                                    </path>
                                                    <path fill="currentColor"
                                                        d="M16 30a14 14 0 1 1 14-14a14.016 14.016 0 0 1-14 14Zm0-26a12 12 0 1 0 12 12A12.014 12.014 0 0 0 16 4Z">
                                                    </path>
                                                </svg>
                                                <span>{{ $t('speed') }}</span>
                                                <select class="select select-sm bg-primary text-neutral-content" v-model="controls.rate.value">
                                                    <option value="3">3x</option>
                                                    <option value="2">2x</option>
                                                    <option value="1.75">1.75x</option>
                                                    <option value="1.5">1.5x</option>
                                                    <option value="1.25">1.25x</option>
                                                    <option value="1">1x</option>
                                                    <option value="0.75">0.75x</option>
                                                    <option value="0.5">0.5x</option>
                                                </select>
                                            </VideoMenuItem>
                                            <VideoMenuItem v-if="anime.attributes.episodes[current].chat != undefined">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                                                    role="img" class="iconify iconify--carbon" width="24" height="24"
                                                    preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                                    <path fill="currentColor"
                                                        d="M17.74 30L16 29l4-7h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.84Z">
                                                    </path>
                                                    <path fill="currentColor" d="M8 10h16v2H8zm0 6h10v2H8z">
                                                    </path>
                                                </svg>
                                                <span>{{ $t('chat') }}</span>
                                                <input class="toggle toggle-primary" type="checkbox" v-model="chatShow">
                                                <select class="select select-sm bg-primary text-neutral-content" v-model="chatSize">
                                                    <option value="10">10%</option>
                                                    <option value="20">20%</option>
                                                    <option value="30">30%</option>
                                                    <option value="40">40%</option>
                                                    <option value="50">50%</option>
                                                    <option value="60">60%</option>
                                                    <option value="70">70%</option>
                                                    <option value="80">80%</option>
                                                    <option value="90">90%</option>
                                                </select>
                                            </VideoMenuItem>
                                        </div>
                                    </template>
                                </VideoMenu>
                                <button class="btn videoBtn" @click="toggleFullScreen">
                                    <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                        class="iconify iconify--carbon" width="32" height="32"
                                        preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                        <path fill="currentColor"
                                            d="M20 2v2h6.586L18 12.582L19.414 14L28 5.414V12h2V2H20zm-6 17.416L12.592 18L4 26.586V20H2v10h10v-2H5.414L14 19.416z">
                                        </path>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                        class="iconify iconify--carbon" width="32" height="32"
                                        preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                                        <path fill="currentColor"
                                            d="M4 18v2h6.586L2 28.582L3.414 30L12 21.414V28h2V18H4zM30 3.416L28.592 2L20 10.586V4h-2v10h10v-2h-6.586L30 3.416z">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </client-only>
                </div>
            </div>
        </div>

        <div class="mt-[30px]">
            <div class="font-bold text-2xl">{{ $t('online') }}</div>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-[10px] w-full gap-[10px]">
                <button v-for="(ep, ind) in anime.attributes.episodes" :key="ep.title" class="btn shadow-lg"
                    :class="{ 'text-white bg-primary': current == ind }" @click="changeEpisode(ind, true)"
                    :title="ep.title">
                    <div class="overflow-hidden text-left text-ellipsis whitespace-nowrap text-sm text-shadow">
                        {{ ep.title }}
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.showModal {
    animation: showModal 0.25s ease;
}

@keyframes showModal {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-50%) scale(0.9);
    }

    to {
        opacity: 1;
        transform: translateX(-50%) translateY(-50%) scale(1);
    }
}

.tooltip::before {
    font-size: inherit;
    padding: inherit;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
</style>
