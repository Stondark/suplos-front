// Import de la APP

import { createApp } from "vue";
import App from "./App.vue";
// Librerías
import { createRouter, createWebHistory } from "vue-router";
// Componentes
import LoginComponent from "./components/LoginComponent.vue";
import DashboardComponent from "./components/DashboardComponent.vue";
import InitDashboardComponent from "./components/InitDashboardComponent.vue";
import CreateEventComponent from "./components/CreateEventComponent.vue";
import ViewEventComponent from "./components/ViewEventComponent.vue";
// Css
import "./assets/styles/global.css";
import "bootstrap/dist/css/bootstrap.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
// Javascript
import "bootstrap/dist/js/bootstrap.js";
import { BASE_URL } from "@/config.js";

const router = createRouter({
  history: createWebHistory(),
  mode: 'history',
  routes: [
    { path: "/login", component: LoginComponent },
    {
      path: "/dashboard",
      component: InitDashboardComponent,
      meta: { requiresAuth: true },
    },
    {
      path: "/events",
      component: DashboardComponent,
      meta: { requiresAuth: true },
    },
    { path: '/events/view/:id', component: ViewEventComponent, props: true , name: "viewEvent"},
    {
      path: "/events/create",
      component: CreateEventComponent,
      meta: { requiresAuth: true },
    }, 
  ],
  
});

// Agrega un guardia de navegación antes de montar la aplicación
router.beforeEach(async (to, from, next) => {
  // Verifica si la ruta requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      const token = localStorage.getItem("tokenAuth");
      // Comprueba si existe un token en el Local Storage
      if (!token) {
        // Si no hay token, redirige al inicio de sesión
        next("/login");
      } else {
        // Si hay token, lo valida
        const response = await fetch(`${BASE_URL}/validToken`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const dataResponse = await response.json();
        if (dataResponse.success) {
          next();
        } else {
          next("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    // Si la ruta no requiere autenticación, permite el acceso
    next();
  }
});

const app = createApp(App);
app.use(router);
app.mount("#app");

