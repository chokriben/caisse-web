<template>
  <v-container fluid>
    <h2>Tableau de bord</h2>

    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Ventes</v-card-title>
          <v-card-text>
            <dx-chart :data-source="salesData">
              <dxi-series
                argument-field="month"
                value-field="sales"
                name="Ventes"
                type="bar"
                color="#42A5F5"
              />
            </dx-chart>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Utilisateurs actifs</v-card-title>
          <v-card-text>
            <h1>{{ activeUsers }}</h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Commandes du jour</v-card-title>
          <v-card-text>
            <dx-pie-chart :data-source="ordersData">
              <dxi-series argument-field="status" value-field="count" />
            </dx-pie-chart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import DxChart, { DxSeries } from "devextreme-vue/chart";
import DxPieChart from "devextreme-vue/pie-chart";

const salesData = ref([
  { month: "Jan", sales: 1200 },
  { month: "Feb", sales: 950 },
  { month: "Mar", sales: 1430 },
]);

const activeUsers = ref(32);

const ordersData = ref([
  { status: "Livrées", count: 14 },
  { status: "En attente", count: 6 },
  { status: "Annulées", count: 3 },
]);
</script>
