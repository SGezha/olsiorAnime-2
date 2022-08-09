<template>
  <div class="bg-base-200 main-bg">
    <NuxtLoadingIndicator />
    <MyNavbar />
    <NuxtPage />
  </div>
</template>

<style>
.main-bg {
  background: linear-gradient(to bottom, hsla(var(--b1) / 1) 0%,  hsla(var(--p) / 0.15) 100%);
}
</style>