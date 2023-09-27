<template>
    <div class="container-event">
        <div class="container-headers">
            <h3>Ver información del evento id {{ id }}</h3>
            <hr>
            <h4>Información básica</h4>
        </div>
        <div class="container-form">
            <form class="form-event" @submit.prevent="uploadFile">
                <div>
                    <label for="object">Objecto</label>
                    <input disabled type="text" id="object" v-model="object" required>
                </div>
                <div>
                    <label for="segment">Actividad (segmento)</label>
                    <input disabled type="text" id="object" v-model="segment" required>

                </div>
                <div>
                    <label for="family">Actividad (familia)</label>
                    <input disabled type="text" id="object" v-model="family" required>
                </div>
                <div>
                    <label for="description">Descripción/Alcance</label>
                    <textarea disabled name="description" id="description" cols="10" rows="1" v-model="description" required></textarea>
                </div>
                <div>
                    <label for="currency">Moneda</label>
                    <input disabled type="text" id="object" v-model="currency" required>
                </div>
                <div>
                    <label for="budget">Presupuesto</label>
                    <input disabled type="text" id="budget" v-model="budget" @input="setFormatMoney" required>
                </div>
                <div>
                    <label for="startdate">Fecha de inicio</label>
                    <input disabled type="text" id="startdate" v-model="startdate"  required>
                </div>
                <div>
                    <label for="starttime">Fecha de fin</label>
                    <input disabled type="text" id="enddate" v-model="enddate" required>
                </div>
                <div class="mb-3">
                    <label for="document" class="form-label"></label>
                    <input type="file" id="document" required class="form-control" ref="fileInput">
                </div>
                <div class="btn-container">
                    <button class="btn btn-primary">Enviar</button>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped>
.container-headers {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.container-form {
    margin: 0 auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 5%;
}

.form-event {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
}

.form-event input,
.form-event select,
.form-event textarea {
    display: block;
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem;
    border-width: 0px;
    border-color: #CCCCCC;
    background-color: #FFFFFF;
    color: #000000;
    border-style: solid;
    border-radius: 18px;
    box-shadow: 0px 0px 5px rgba(66, 66, 66, .75);
    text-shadow: 0px 0px 5px rgba(66, 66, 66, .75);
}

.btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<script>
import Swal from 'sweetalert2';
import { BASE_URL } from "@/config.js";
const token = localStorage.getItem('tokenAuth');
export default {
    props: ['id'],
    data() {
        return {
            object: '',
            segment: '',
            family: '',
            description: '',
            currency: '',
            budget: '',
            startdate: '',
            starttime: '',
            enddate: '',
            endtime: ''
        }
    }, 

    methods: {
        async getInfoEvent(){
            const id = this.$route.params.id;
            try {
                const response = await fetch(`${BASE_URL}/client/events/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }});
                
                const dataResponse = await response.json();
                if(dataResponse.success){
                    this.object = dataResponse.data[0].object;
                    this.segment = dataResponse.data[0].description_segment;
                    this.family = dataResponse.data[0].description_family;
                    this.description = dataResponse.data[0].description;
                    this.currency = dataResponse.data[0].currency_type;
                    this.budget = dataResponse.data[0].budget;
                    this.startdate = dataResponse.data[0].full_start_date;
                    this.enddate  = dataResponse.data[0].full_end_date;
                } else {
                    this.$router.push('/dashboard');
                    Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: dataResponse.message,
                    });
                }
                
            } catch (error) {
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                });
                this.$router.push('/events');
            }
        }, 
        async uploadFile(){
            const id = this.$route.params.id;
            try {
                const fileInput = this.$refs.fileInput;
                const file = fileInput.files[0];
                if (!file) {
                    // Verifica si se seleccionó un archivo
                    alert("Selecciona un archivo para subir.");
                    return;
                }
                const formData = new FormData();
                formData.append("document", file);
                const response = await fetch(`${BASE_URL}/client/events/${id}/upload`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData});

                const dataResponse = await response.json();
                if(dataResponse.success){
                    Swal.fire({
                    icon: 'success',
                    title: 'Perfecto!',
                    text: 'Archivo subido correctamente',
                    });
                    this.$router.push('/events');
                }

            } catch (error) {
                console.log(error)
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                });
                // this.$router.push('/events');
            }
        }
    },
    mounted(){
        this.getInfoEvent()
    }

};
</script>







  