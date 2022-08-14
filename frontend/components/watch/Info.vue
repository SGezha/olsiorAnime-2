<script setup>
import { Result } from 'postcss';

const router = useRouter()
const { update, delete: _delete, findOne } = useStrapi4()
const tab = useState(() => 'season')
const twName = useCookie('tw_login')

const props = defineProps({
    anime: {
        type: Object,
        default: () => { }
    }
})

if (props.anime.attributes.seasons == null) tab.value = 'arches'
if (props.anime.attributes.arches == null && props.anime.attributes.seasons == null) tab.value = 'ep'

const deleteMark = (id) => {
    _delete('time-marks', id).then(() => {
        findOne('animes', props.anime.id, { filters: { url: router.currentRoute._value.params.name }, populate: '*' }).then((res) => {
            props.anime.attributes.timemarks = res.data.attributes.timemarks
        })
    })
}

const filterMarks = computed(() => {
    let haveMarks = []
    let result = []
    props.anime.attributes.timemarks.data.forEach(ep => {
        if(haveMarks.indexOf(ep.attributes.epId) == -1) {
            haveMarks.push(ep.attributes.epId)
        }
    })
    haveMarks.forEach(ind => {
        props.anime.attributes.episodes[ind].id = ind
        result.push(props.anime.attributes.episodes[ind])
    })
    return result
})
</script>

<template>
    <div class="mt-[30px]">
        <div class="font-bold text-2xl">{{ $t('info') }}</div>
    </div>
    <div class="tabs mt-[15px] flex w-[100%] relative">
        <a class="tab text-xl tab-bordered transition-colors" v-if="anime.attributes.seasons != null"
            @click="tab = 'season'" :class="{ 'tab-active': tab == 'season' }">{{ $t('seasons') }}</a>
        <a class="tab text-xl tab-bordered transition-colors" v-if="anime.attributes.arches != null"
            @click="tab = 'arches'" :class="{ 'tab-active': tab == 'arches' }">{{ $t('arches') }}</a>
        <a class="tab text-xl tab-bordered transition-colors" v-if="anime.attributes.op != null" @click="tab = 'op'"
            :class="{ 'tab-active': tab == 'op' }">{{ $t('op') }}</a>
        <a class="tab text-xl tab-bordered transition-colors" v-if="anime.attributes.ed != null" @click="tab = 'ed'"
            :class="{ 'tab-active': tab == 'ed' }">{{ $t('ed') }}</a>
        <a class="tab text-xl tab-bordered transition-colors" @click="tab = 'mark'"
            :class="{ 'tab-active': tab == 'mark' }">{{ $t('mark') }}</a>
    </div>

    <div class="mt-[15px] flex w-[100%] flex-col showTab" v-if="tab == 'season'">
        <span v-for="(season, ind) in anime.attributes.seasons">
            {{ ind + 1 }}. <a class="link shadow-md" :href="season.url">{{ season.title }}</a> {{ season.text ? ' - ' +
                    season.text : ''
            }}
        </span>
    </div>

    <div class="mt-[15px] flex w-[100%] flex-col showTab" v-if="tab == 'arches'">
        <div v-html="anime.attributes.arches.split('\\n').join('<br/>')"></div>
    </div>

    <div class="mt-[15px] w-[100%] flex flex-wrap gap-[5px] showTab" v-if="tab == 'op'">
        <div v-for="(video, ind) in anime.attributes.op">
            <label :for="`modal-op-${ind}`" class="btn modal-button">{{ video.title }} ({{ video.episodes }})</label>
        </div>
    </div>

    <div class="mt-[15px] w-[100%] flex flex-wrap gap-[5px] showTab" v-if="tab == 'ed'">
        <div v-for="(video, ind) in anime.attributes.ed">
            <label :for="`modal-ep-${ind}`" class="btn modal-button">{{ video.title }} ({{ video.episodes }})</label>
        </div>
    </div>

    <div class="mt-[15px] w-[100%] flex flex-wrap gap-[5px] showTab text-neutral-content" v-if="tab == 'mark'">
        <div v-for="(ep, ind) in filterMarks" class="bg-neutral p-[10px] rounded-md">
            <div class="text-lg font-bold">
                {{ ep.title }}
            </div>
            <div v-for="mark in anime.attributes.timemarks.data.filter(a => a.attributes.epId == ep.id)" class="flex items-center">
                <div class="">{{ mark.attributes.title }} - {{ mark.attributes.time }} {{ mark.attributes.author ? `(${mark.attributes.author})` : '' }}</div>
                <button @click="deleteMark(mark.id)" v-if="mark.attributes.author == twName && twName != undefined" class="text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22"
                        height="22" aria-hidden="true" role="img" class="iconify iconify--mdi"
                        preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <div v-if="tab == 'op'" v-for="(video, ind) in anime.attributes.op"
        class="w-full bg-black rounded-md overflow-hidden">
        <input type="checkbox" :id="`modal-op-${ind}`" class="modal-toggle" />
        <label :for="`modal-op-${ind}`" class="modal cursor-pointer">
            <label
                class="modal-box relative min-h-[60vh] min-w-[60vw] p-0 flex items-center justify-center aspect-video"
                for="">
                <iframe width="100%" height="auto" style="aspect-ratio: 16 / 9;"
                    :src="`https://www.youtube.com/embed/${video.url.split('?v=')[1]}`" title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </label>
        </label>
    </div>

    <div v-if="tab == 'ed'" v-for="(video, ind) in anime.attributes.ed"
        class="w-full bg-black rounded-md overflow-hidden">
        <input type="checkbox" :id="`modal-ep-${ind}`" class="modal-toggle" />
        <label :for="`modal-ep-${ind}`" class="modal cursor-pointer">
            <label class="modal-box relative min-h-[60vh] min-w-[60vw] p-0 flex items-center justify-center" for="">
                <iframe width="100%" height="auto" style="aspect-ratio: 16 / 9;"
                    :src="`https://www.youtube.com/embed/${video.url.split('?v=')[1]}`" title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </label>
        </label>
    </div>
</template>

<style>
.showTab {
    animation: animTab 0.25s ease-out;
}

.tab.tab-active {
    border-color: hsla(var(--p) / 1);
}

.info-anim-enter-active,
.info-anim-leave-active {
    position: relative;
    left: 0;
    transition: 0.5s ease;
}

.info-anim-enter-from,
.info-anim-leave-to {
    left: 15px;
    opacity: 0;
}

@keyframes animTab {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.tabs::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: hsla(var(--bc) / 1);
    margin-top: -1px;
}
</style>