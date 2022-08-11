<script setup>
const { find } = useStrapi4()
const { data: donates } = useAsyncData('donates', () => find('donates', { pagination: { pageSize: 50 }, populate: '*', sort: 'amount:desc' }))
</script>

<template>
    <a href="https://www.donationalerts.com/r/sgezha" target="_blank"
        class="mx-auto marquee max-w-[1330px] w-100 px-[10px] py-[10px] ">
        <span class="donate-text">
            <span>{{ $t('donate') }}: </span>
            <div class="inline-block mr-[5px]" v-for="don in donates.data">
                <span class="font-bold text-primary">
                    {{ don.attributes.username }}
                </span>
                <span> - {{ don.attributes.amount }} ₽</span>
            </div>
        </span>
    </a>
</template>