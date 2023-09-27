<template>
    <div class="container-event">
      <h4>Procesos / Eventos.</h4>
      <!-- Mostrar los botones adicionales si showBotones es verdadero -->
      <div v-if="showBotones" class="container-buttons">
        
        <button><router-link to="/events/create">Crear</router-link></button>
        <button><router-link to="/events">Ver todos</router-link></button>
        <button>Consultar</button>
      </div>
      <button @click="mostrarBotones">Acceder</button>
    </div>
  </template>

<style scoped>
.container-event{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
    height: 100%;
    margin: 5% auto;
    background-color: #30448d;
    color: #ffff;
}

.container-event h4{
    padding: 1.5rem;
}

.container-event > button{
    width: 100%;
    border: none;
    background-color: #2b397a;
    color: #ffff;
}

.container-buttons{
    display: flex;
    width: 100%;
    margin: 0.8rem;
}

.container-buttons button{
    width: 100%;
    background-color: #30448d;
    border: #ffff 1px solid;
    margin: 0.5rem;
    color: #ffff;
    padding: 1rem;
}

.container-buttons a{
    color: #ffff;
    text-decoration: none;
}

</style>
<script>
export default {
  data() {
    return {
      showBotones: false, // Variable para controlar la visibilidad de los botones adicionales
    };
  },
  methods: {
    mostrarBotones() {
        // Cambia el valor de showBotones para mostrar los botones adicionales
        this.showBotones = (!this.showBotones) ? true : !this.showBotones;

    },
  },
};
</script>







  