<script setup>
const twName = useCookie('tw_login')
const twImg = useCookie('tw_img')
const twId = useCookie('tw_id')
const props = defineProps({
    url: {
        type: String,
        default: () => ''
    }
})
const { findOne, find, create, delete: _delete } = useStrapi4()
const comments = useState(() => null)
const disableCom = useState(() => false)
const { textarea, input } = useTextareaAutosize()
const commentPage = useState(() => 1)

onMounted(async () => {
    comments.value = await find('comments', { populate: '*', pagination: { pageSize: 25, page: commentPage.value }, sort: 'createdAt:desc', filters: { url: props.url } })
})

watch(commentPage, () => {
    updateComments()
})

const updateComments = async () => {
    comments.value = await find('comments', { populate: '*', pagination: { pageSize: 25, page: commentPage.value }, sort: 'createdAt:desc', filters: { url: props.url } })
}

const sendCom = async () => {
    if(input.value == undefined || disableCom.value) return
    disableCom.value = true
    create('comments', { url: props.url, msg: input.value, author: twName.value, img: twImg.value, twitchId: twId.value.toString() }).then(async () => {
        input.value = ''
        await updateComments()
        disableCom.value = false
    })
}

const deleteCom = async (id) => {
    await _delete('comments', id)
    await updateComments()
}
</script>

<template>
    <div class="mt-[30px]">
        <div class="text-center font-bold my-[30px]" v-if="!twName">
            {{ $t('comhelp') }} <a class="link" href="/server-api/authorize">{{ $t('comauth') }}</a>.
        </div>
        <div class="" v-if="twName">
            <div class="text-lg">{{ $t('comtext') }}</div>
            <div v-if="twName" class="flex gap-[10px]">
                <textarea ref="textarea" v-model="input" :disabled="disableCom" type="text" class="input input-primary resize-none leading-5 py-[10px] input-bordered w-full" />
                <button @click="sendCom" class="btn btn-primary">{{ $t('comsend') }}</button>
            </div>
        </div>

        <div v-if="comments != null" class="mt-[15px] flex flex-col gap-[10px]">
            <div v-for="com in comments.data" class="bg-neutral px-[20px] py-[20px] rounded-md relative">
                <div class="flex justify-between items-center">
                    <a :href="`/profile/${com.attributes.author}`" class="flex items-center">
                        <div class="bg-neutral-content w-[40px] rounded-full mr-[10px]">
                            <img class="w-full h-full" :src="com.attributes.img" alt="">
                        </div>
                        <div class="text-lg font-bold text-neutral-content">{{ com.attributes.author }}</div>
                    </a>
                    <div class="text-neutral-content">{{ new Date(com.attributes.createdAt).toLocaleDateString() }} {{
                    new Date(com.attributes.createdAt).toLocaleTimeString() }}</div>
                </div>
                <div class="pt-[10px] text-neutral-content whitespace-pre-wrap w-[90%] md:w-[95%] block break-words max-h-[500px] overflow-y-auto">{{ com.attributes.msg }}</div>
                <button v-if="com.attributes.twitchId == twId" @click="deleteCom(com.id)"
                    class="absolute w-[30px] h-[30px] p-[5px] bg-error flex items-center justify-center rounded-full text-white right-[20px] bottom-[20px]">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true" role="img" class="iconify iconify--mdi" preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"></path>
                    </svg>
                </button>
            </div>
            <div class="btn-group flex justify-center" v-if="comments.meta.pagination.pageCount > 1">
                <button v-for="(page, ind) in comments.meta.pagination.pageCount" :class="{ 'btn-active': ind + 1 == commentPage}" @click="commentPage = ind + 1" class="btn">{{ ind + 1 }}</button>
            </div>
        </div>
    </div>
</template>