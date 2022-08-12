
<template>
  <div class="bg-base-200 main-bg">
    <MyNavbar />
    <div class="">
      <NuxtPage />
    </div>
  </div>
</template>

<script>
onMounted(() => {
  navigator.serviceWorker.register('sw.js')
    .then(function (registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function (err) {
      console.log('Service worker registration failed, error:', err);
    });
})
</script>

<style>
.main-bg {
  background: linear-gradient(to bottom, hsla(var(--b1) / 0.5) 0%, hsla(var(--p) / 0.15) 100%);
}

*::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

*::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}

*::-webkit-scrollbar-thumb {
  background: hsla(var(--p) / 1);
  border: 0px none #ffffff;
  border-radius: 50px;
}

*::-webkit-scrollbar-thumb:hover {
  background: hsla(var(--n) / 0.5);
}

*::-webkit-scrollbar-thumb:active {
  background: hsla(var(--p) / 1);
}

*::-webkit-scrollbar-track {
  background: hsla(var(--n) / 1);
  border: 0px none #ffffff;
  border-radius: 50px;
}

*::-webkit-scrollbar-track:hover {
  background: hsla(var(--n) / 0.5);
}

*::-webkit-scrollbar-track:active {
  background: hsla(var(--n) / 0.5);
}

*::-webkit-scrollbar-corner {
  background: transparent;
}
</style>