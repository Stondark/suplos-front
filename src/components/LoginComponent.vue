<template>
    <div class="div-login">
        <h1>Iniciar sesión</h1>
        <form @submit.prevent="login" class="form">
            <label for="username">Usuario:</label>
            <input type="text" id="username" v-model="username" />
            <label for="password">Contraseña:</label>
            <input type="password" id="password" v-model="password" />
            <button type="submit">Iniciar Sesión</button>
        </form>
    </div>
</template>

<style scoped> 

.div-login {
    display: flex;
    width: 50%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

.form {
    display: grid;
}

.form button,
.form input {
    display: block;
    width: 100%;
    margin: 10%;
    padding: 0.5rem;
    border-width: 0px;
    border-color: #CCCCCC;
    background-color: #FFFFFF;
    color: #000000;
    border-style: solid;
    border-radius: 18px;
    box-shadow: 0px 0px 5px rgba(66,66,66,.75);
    text-shadow: 0px 0px 5px rgba(66,66,66,.75);
}

.form button {
    color: #fff;
    background-color: #0066CC;
    padding: 10px 30px;
    border: 2px solid #0066cc;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
    border-radius: 50px;
    transition: 1000ms;
    transform: translateY(0);
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
}

.form button:hover {
    transition: 1000ms;
    padding: 10px 50px;
    transform: translateY(-0px);
    background-color: #fff;
    color: #0066cc;
    border: solid 2px #0066cc;
}
</style>
  
<script>
import Swal from 'sweetalert2';
import { BASE_URL } from "@/config.js";
export default {
    name: "LoginComponent",
    data() {
        return {
            username: "",
            password: "",
        };
    },
    methods: {
        async login() {
            const bodyData = {
                username: this.username,
                password: this.password
            };

            try {
                const response = await fetch(`${BASE_URL}/auth`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData)});
                
                const dataResponse = await response.json();
                if(dataResponse.success){
                    localStorage.setItem('tokenAuth', dataResponse.data.token);
                    localStorage.setItem('userLogged', this.username);
                    this.$router.push('/dashboard');
                } else {
                    Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: dataResponse.message,
                    })
                    this.$router.push('/login');
                }

            } catch (error) {
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                })
            }
        },
    },
};
</script>




  