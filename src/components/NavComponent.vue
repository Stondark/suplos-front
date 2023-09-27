<template>
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="navbar-logo">Suplos</router-link>
        <router-link to="/dashboard" class="navlink">Dashboard</router-link>
      </div>
    </nav>
</template>

<style scoped>
    .navbar {
    background-color: #333; 
    color: #fff; 
    padding: 10px 0; 
    margin-bottom: 1rem;
    }

    .container {
    max-width: 1200px; 
    margin: 0 auto; 
    display: flex; 
    justify-content: space-evenly; 
    align-items: center; 
    }

    .navbar-logo {
    font-size: 24px; 
    text-decoration: none; 
    color: #fff; 
    font-weight: bold;
    }

    .navlink {
    font-size: 24px; 
    text-decoration: none; 
    color: #fff; 
    }

</style>
<script>
export default {
  name: "NavComponent"
};
</script>

