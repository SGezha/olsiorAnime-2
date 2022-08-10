<script setup>
const twName = useCookie('tw_login')
const twImg = useCookie('tw_img')

const logout = () => {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); })
    window.location = '/'
}
</script>

<template>
    <div class="bg-base-300 bg-opacity-50 z-10 relative">
        <div class="navbar max-w-[1350px] mx-auto">
            <div class="navbar-start">
                <a class="btn btn-ghost normal-case text-xl flex gap-[10px] items-center" href="/">
                    <img src="/minloading.webp" class="rounded-full overflow-hidden w-[30px]" alt="">
                    <div class="mb-[3px]">
                        {{ $t('title') }}
                    </div>
                </a>
            </div>
            <div class="navbar-end">
                <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            aria-hidden="true" role="img" class="iconify iconify--ic" width="24" height="24"
                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z">
                            </path>
                        </svg>
                    </label>
                    <ul tabindex="0" class="dropdown-content flex mt-3 p-3 shadow bg-base-300 gap-3 rounded-box w-52">
                        <SettingsSelectTheme />
                        <SettingsSelectLang />
                    </ul>
                </div>
                <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-circle">
                        <img v-if="twName" class="w-[36px] h-[36px]" :src="twImg" alt="">
                        <svg v-else width="36" height="36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            aria-hidden="true" role="img" class="iconify iconify--carbon"
                            preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                            <path fill="currentColor"
                                d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5Zm0 8a3 3 0 1 1 3-3a3.003 3.003 0 0 1-3 3Z">
                            </path>
                            <path fill="currentColor"
                                d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm-6 24.377V25a3.003 3.003 0 0 1 3-3h6a3.003 3.003 0 0 1 3 3v1.377a11.899 11.899 0 0 1-12 0Zm13.992-1.451A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0Z">
                            </path>
                        </svg>
                    </label>
                    <ul tabindex="0"
                        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52">
                        <!-- <li>
                            <a class="justify-between">
                                Profile
                                <span class="badge">New</span>
                            </a>
                        </li> -->
                        <li v-if="twName"><a>{{ twName }}</a></li>
                        <li @click="logout" v-if="twName"><a>Logout</a></li>
                        <li v-else><a href="/server-api/authorize">Login</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>