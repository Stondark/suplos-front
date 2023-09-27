<template>
    <div class="container-event">
        <div class="container-headers">
            <h3>Crear proceso/evento</h3>
            <hr>
            <h4>Información básica</h4>
        </div>
        <div class="container-form">
            <form class="form-event" @submit.prevent="sendData">
                <div>
                    <label for="object">Objecto</label>
                    <input type="text" id="object" v-model="object" required>
                </div>
                <div>
                    <label for="segment">Actividad (segmento)</label>
                    <select name="segment" id="segment" v-model="segment" @change="getFamilyBySegment" required>
                        <option value="" disabled>Selecciona una opción</option>
                        <option v-for="option in optionsSegment" :key="option.id" :value="option.id">{{
                            option.description_segment }}</option>
                    </select>
                </div>
                <div>
                    <label for="family">Actividad (familia)</label>
                    <select name="family" id="family" v-model="family" required>
                        <option value="" disabled>Selecciona una opción</option>
                        <option v-for="option in optionsFamily" :key="option.id" :value="option.id">{{
                            option.description_family }}</option>
                    </select>
                </div>
                <div>
                    <label for="description">Descripción/Alcance</label>
                    <textarea name="description" id="description" cols="10" rows="1" v-model="description" required></textarea>
                </div>
                <div>
                    <label for="currency">Moneda</label>
                    <select name="currency" id="currency" v-model="currency" required>
                        <option value="" disabled>Selecciona una opción</option>
                        <option v-for="option in optionsCurrency" :key="option.id" :value="option.id">{{
                            option.currency_type }}</option>
                    </select>
                </div>
                <div>
                    <label for="budget">Presupuesto</label>
                    <input type="text" id="budget" v-model="budget" @input="setFormatMoney" required>
                </div>
                <div>
                    <label for="startdate">Fecha de inicio</label>
                    <input type="date" id="startdate" v-model="startdate" :min="getNextDay()" required>
                </div>
                <div>
                    <label for="starttime">Hora de inicio</label>
                    <input type="time" id="starttime" v-model="starttime" required>
                </div>
                <div>
                    <label for="enddate">Fecha de Cierre</label>
                    <input type="date" id="enddate" v-model="enddate" :min="startdate" required>
                </div>
                <div>
                    <label for="endtime">Hora de Cierre</label>
                    <input type="time" id="endtime" v-model="endtime" required>
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
const token = localStorage.getItem("tokenAuth");
const creator = localStorage.getItem("userLogged");
export default {
    data() {
        return {
            object: '',
            optionsSegment: [], // Almacena los datos de la API aquí
            segment: '',
            optionsFamily: [],
            family: '',
            description: '',
            optionsCurrency: [],
            currency: '',
            budget: '',
            startdate: '',
            starttime: '',
            enddate: '',
            endtime: ''
        };
    },
    methods: {
        async getSegments() {
            try {
                const response = await fetch(`${BASE_URL}/client/segments`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const dataResponse = await response.json();
                this.optionsSegment = dataResponse.data;
            } catch (error) {
                console.error(error);
            }
        },
        async getFamilyBySegment() {
            if (this.segment) {
                try {
                    const response = await fetch(`${BASE_URL}/client/segments/${this.segment}/family`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const dataResponse = await response.json();
                    this.optionsFamily = dataResponse.data;
                } catch (error) {
                    console.error(error);
                }
            }

        },
        async getCurrency() {

            try {
                const response = await fetch(`${BASE_URL}/client/currency`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const dataResponse = await response.json();
                this.optionsCurrency = dataResponse.data;
            } catch (error) {
                console.error(error);
            }
        },
        setFormatMoney() {
            // Elimina todos los caracteres que no sean números y convierte la cadena a un número
            let numericValue = Number(this.budget.replace(/[^0-9]/g, ''));

            // Verifica si el valor es un número válido antes de darle formato de moneda
            if (!isNaN(numericValue)) {
                // Formatea el número como moneda usando toLocaleString
                this.budget = Number(numericValue).toLocaleString();
            } else {
                // Si el valor no es un número válido
                this.budget = '';
            }
        }, async sendData() {
            const bodyData = {
                creator: creator,
                family: this.family,
                segments: this.segment,
                description: this.description,
                currency: this.currency,
                object: this.object,
                budget: this.budget,
                start_date: this.startdate,
                start_time: this.starttime,
                end_date: this.enddate,
                end_time: this.endtime
            };
            try {
                const response = await fetch(`${BASE_URL}/client/events`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(bodyData)
                });

                const dataResponse = await response.json();
                if(dataResponse.success){
                    this.$router.push('/events');
                } else {
                    Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: dataResponse.message});
                }


            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error,
                })
            }

        },
        getNextDay(){
            const hoy = new Date();
            const manana = new Date(hoy);
            manana.setDate(hoy.getDate() + 1);

            // Formatear la fecha como "YYYY-MM-DD" para el atributo min
            const year = manana.getFullYear();
            const month = (manana.getMonth() + 1).toString().padStart(2, '0');
            const day = manana.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }, async mounted() {
        await this.getSegments(),
        await this.getCurrency()
    }
};
</script>







  