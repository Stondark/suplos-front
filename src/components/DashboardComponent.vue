<template>
    <div>
        <div class="col-lg-8 offset-lg-2">
            <button class="btn btn-success" @click="generateReport()">Excel</button>
            <button class="btn btn-outline-info" @click="updateStatus()">Actualizar estados</button>
            <a v-if="urlReport" :href="urlReport" target="_blank" class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">Reporte generado</a>
        </div>
        <div class="col-lg-8 offset-lg-2">
            <div class="table-responsive">
                <DataTable :data="events" :columns = "columns" :options="{ dom:'Bfrtip', autoWidth: true, columnDefs: [{targets: '_all', width: 'auto',}]}" class="table table-striped table-bordered display" id="table-event" ref="tableEvent">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Objecto</th>
                            <th>Usuario</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha fin</th>
                            <th>Estado</th>
                            <th>Presupuesto</th>
                            <th>Segmento</th>
                            <th>Familia</th>
                            <th>Tipo moneda</th>
                            <th>Descripción</th>
                            <th>Documentación</th>
                            <th>Descargar</th>
                        </tr>
                    </thead>
                </DataTable>
            </div>
        </div>
    </div>
</template>
<script setup>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
// eslint-disable-next-line
import Buttons from 'datatables.net-buttons-bs5';
import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5';
import pdfMake from 'pdfmake';
// eslint-disable-next-line
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-responsive-bs5';
import JsZip from 'jszip';

window.JsZip = JsZip;
pdfMake.vfs = pdfFonts.pdfMake.vfs;
DataTable.use(DataTablesCore);
DataTable.use(pdfMake);
DataTable.use(ButtonsHtml5);
</script>
<script>
import Swal from 'sweetalert2';
import { BASE_URL } from "@/config.js";
import $ from 'jquery';
const token = localStorage.getItem('tokenAuth');

export default {
    components: {DataTable},
    name: "DashboardComponent",
    data(){
        return{
            urlReport: '',
            events:null,
            columns: [
                {data: `id`},
                {data: `object`},
                {data: `username`},
                {data: `full_start_date`},
                {data: `full_end_date`},
                {data: `status`},
                {data: `budget`},
                {data: `description_segment`},
                {data: `description_family`},
                {data: `currency_type`},
                {data: `description`},
                {
                    data: null, // Dejamos data como null para que no se asocie con ningún campo en particular
                    render: function (data, type, row) {
                        return `<button class="btn btn-success" data-id="${row.id}">Añadir</button>`;
                    },
                },
                {
                    data: null, // Dejamos data como null para que no se asocie con ningún campo en particular
                    render: function (data, type, row) {
                        return `<button class="btn btn-info" data-id="${row.id}">Descargar</button>`;
                    },
                },
            ]
        }
    },
    mounted(){
        this.getEvents(),
        this.setEvents()
    },
    methods: {
        setEvents() {
            const dataTable = $('#table-event').DataTable();
            // Agrega un evento de clic a los botones generados en la tabla
            dataTable.on('click', 'button.btn-success', (e) => {
                const button = $(e.currentTarget);
                const id = button.data('id'); // Obtén el valor del atributo data-id
                this.redirectToView(id);
            });

            dataTable.on('click', 'button.btn-info', (e) => {
                const button = $(e.currentTarget);
                const id = button.data('id'); // Obtén el valor del atributo data-id
                this.getDocuments(id);
            });
        },
        async getEvents() {
            try {
                const response = await fetch(`${BASE_URL}/client/events`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }});
                
                const dataResponse = await response.json();
                this.events = dataResponse.data;
                console.log(this.events);
            } catch (error) {
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                })
            }
        },
        async generateReport(){
            try {
                const response = await fetch(`${BASE_URL}/client/events/report`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }});
                
                const dataResponse = await response.json();
                if(dataResponse.success){
                    this.urlReport = dataResponse.data.url;
                }
                
            } catch (error) {
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                })
            }
        },
        redirectToView(id){
            this.$router.push({ name: 'viewEvent', params: { id }});
        },
        async getDocuments(id) {
            try {
                const response = await fetch(`${BASE_URL}/client/events/${id}/documents`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }});
                
                const dataResponse = await response.json();
                if(dataResponse.success){
                    dataResponse.data.forEach(element => {
                        window.open(element);
                    });
                } else{
                    Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: dataResponse.message,
                    })
                }
            } catch (error) {
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                })
            }
        },
        async updateStatus(){
            try {
                const response = await fetch(`${BASE_URL}/client/events/status`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }});
                
                const dataResponse = await response.json();
                if(dataResponse.success){
                    Swal.fire({
                    icon: 'success',
                    title: 'Actualizado correctamente'
                    });
                    this.$router.go();
                } else {
                    Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: dataResponse.message,
                    })
                }
                
            } catch (error) {
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
                })
            }
        }
    }
};
</script>


  