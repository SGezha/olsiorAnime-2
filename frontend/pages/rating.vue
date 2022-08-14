<script setup>
const router = useRouter()
const config = useRuntimeConfig()
const load = useState(() => false)
const { find } = useStrapi4()
const { data: top, pending, error, refresh } = await useAsyncData(
    'top',
    () => $fetch(`http://localhost:8080/server-api/gettop?page=${router.currentRoute._value.query.page != undefined ? router.currentRoute._value.query.page : '1'}`)
)

</script>

<template>
    <div class="max-w-[1350px] mx-auto px-[10px] pb-[20px]">
        <MyDonate />

        <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
                <thead>
                    <tr>
                        <th></th>
                        <th>Ник</th>
                        <th>Количество сообщений</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(t, ind) in top">
                        <th>{{ ind + 1 + (router.currentRoute._value.query.page > 1 ? (router.currentRoute._value.query.page - 1) * 50 : 0) }}</th>
                        <td class="text-lg font-bold text-primary"><a :href="`/profile/${t.author}`">{{ t.author }}</a></td>
                        <td>{{ t.countMsg }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full flex justify-center mt-[15px] gap-[5px]">
            <a :href="`/rating?page=${router.currentRoute._value.query.page > 1 ? router.currentRoute._value.query.page - 1 : 1}`" class="btn btn-primary">«</a>
            <button class="btn btn-primary">Страница {{ router.currentRoute._value.query.page }}</button>
            <a :href="`/rating?page=${parseInt(router.currentRoute._value.query.page) + 1}`" class="btn btn-primary">»</a>
        </div>
    </div>
</template>