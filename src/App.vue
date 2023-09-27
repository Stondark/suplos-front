<template>
  <div id="app">
  <NavComponent/>
  <router-view></router-view>
  </div>

</template>
<script>
import NavComponent from "./components/NavComponent.vue";

export default {
  name: 'App',
  components: {
    NavComponent
  }
}
</script>

