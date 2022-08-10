import indexVue from '~~/pages/index.vue';
<script setup>
const tab = useState(() => 'season')

const props = defineProps({
    anime: {
        type: Object,
        default: () => {}
    }
})

if(props.anime.attributes.seasons == null) tab.value = 'arches'
if(props.anime.attributes.arches == null && props.anime.attributes.seasons == null) tab.value = 'ep'
</script>

<template>
    <div class="mt-[30px]">
        <div class="font-bold text-2xl">{{ $t('info') }}</div>
    </div>
    <div class="tabs mt-[15px] flex w-[100%] ">
        <a class="tab text-xl tab-bordered transition-colors" v-if="anime.attributes.seasons != null" @click="tab = 'season'" :class="{'tab-active': tab == 'season'}">{{ $t('seasons') }}</a> 
        <a class="tab text-xl tab-bordered transition-colors" v-if="anime.attributes.arches != null" @click="tab = 'arches'" :class="{'tab-active': tab == 'arches'}">{{ $t('arches') }}</a> 
        <a class="tab text-xl tab-bordered transition-colors" v-if="anime.attributes.op != null" @click="tab = 'op'" :class="{'tab-active': tab == 'op'}">{{ $t('op') }}</a>
        <a class="tab text-xl tab-bordered transition-colors" v-if="anime.attributes.ed != null" @click="tab = 'ed'" :class="{'tab-active': tab == 'ed'}">{{ $t('ed') }}</a>
    </div>

    <div class="mt-[15px] flex w-[100%] flex-col showTab" v-if="tab == 'season'">
        <span v-for="(season, ind) in anime.attributes.seasons">
            {{ ind + 1}}. <a class="link shadow-md" :href="season.url">{{ season.title }}</a> {{ season.text ? ' - ' + season.text : '' }}
        </span>
    </div>

    <div class="mt-[15px] flex w-[100%] flex-col showTab" v-if="tab == 'arches'">
        <div v-html="anime.attributes.arches.split('\\n').join('<br/>')"></div>
    </div>

    <div class="mt-[15px] w-[100%] flex flex-wrap gap-[5px] showTab" v-if="tab == 'op'">
        <div v-for="(video, ind) in anime.attributes.op">
            <label :for="`modal-op-${ind}`" class="btn modal-button">{{ video.title }} ({{ video.episodes }})</label>
        </div>
        <div class=""></div>
    </div>

    <div class="mt-[15px] w-[100%] flex flex-wrap gap-[5px] showTab" v-if="tab == 'ed'">
        <div v-for="(video, ind) in anime.attributes.ed">
            <label :for="`modal-ep-${ind}`" class="btn modal-button">{{ video.title }} ({{ video.episodes }})</label>
        </div>
        <div class=""></div>
    </div>

    <div v-if="tab == 'op'" v-for="(video, ind) in anime.attributes.op" class="w-full bg-black rounded-md overflow-hidden">
        <input type="checkbox" :id="`modal-op-${ind}`" class="modal-toggle" />
        <label :for="`modal-op-${ind}`" class="modal cursor-pointer">
            <label class="modal-box relative min-h-[60vh] min-w-[60vw] p-0 flex items-center justify-center aspect-video" for="">
                <iframe width="100%" height="auto" style="aspect-ratio: 16 / 9;" :src="`https://www.youtube.com/embed/${video.url.split('?v=')[1]}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </label>
        </label>
    </div>

    <div v-if="tab == 'ed'" v-for="(video, ind) in anime.attributes.ed" class="w-full bg-black rounded-md overflow-hidden">
        <input type="checkbox" :id="`modal-ep-${ind}`" class="modal-toggle" />
        <label :for="`modal-ep-${ind}`" class="modal cursor-pointer">
            <label class="modal-box relative min-h-[60vh] min-w-[60vw] p-0 flex items-center justify-center" for="">
                <iframe width="100%" height="auto" style="aspect-ratio: 16 / 9;" :src="`https://www.youtube.com/embed/${video.url.split('?v=')[1]}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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