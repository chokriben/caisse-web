<template>
  <v-container fluid class="pa-6">
    <h2 class="text-h4 font-weight-bold mb-6">
      📊 Tableau de bord de la caisse
    </h2>

    <v-row dense>
      <!-- Ventes mensuelles -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="4" class="pa-3">
          <v-card-title class="text-h6">📅 Ventes mensuelles</v-card-title>
          <v-card-text>
            <dx-chart :data-source="salesData" class="chart">
              <dx-series
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

      <!-- Stats aujourd'hui -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="4" class="pa-3">
          <v-card-title class="text-h6">📆 Statistiques d'aujourd'hui</v-card-title>
          <v-card-text>
            <p><strong>🧾 Tickets :</strong> {{ stats.tickets_today }}</p>
            <p><strong>💰 Total :</strong> {{ stats.total_today }} TND</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Stats semaine -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="4" class="pa-3">
          <v-card-title class="text-h6">📈 Statistiques de la semaine</v-card-title>
          <v-card-text>
            <p><strong>🧾 Tickets :</strong> {{ stats.tickets_week }}</p>
            <p><strong>💰 Total :</strong> {{ stats.total_week }} TND</p>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Commandes du jour -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="4" class="pa-3">
          <v-card-title class="text-h6">📦 Commandes du jour</v-card-title>
          <v-card-text>
            <dx-pie-chart :data-source="ordersData" class="chart">
              <dx-series argument-field="status" value-field="count" />
            </dx-pie-chart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import DxChart, { DxSeries } from 'devextreme-vue/chart';
import DxPieChart from 'devextreme-vue/pie-chart';

export default {
  components: {
    DxChart,
    DxSeries,
    DxPieChart,
  },
  setup() {
    const stats = ref({
      tickets_today: 0,
      total_today: 0,
      tickets_week: 0,
      total_week: 0,
    });

    const activeUsers = ref(32);
    const salesData = ref([]);
    const ordersData = ref([
      { status: "Livrées", count: 14 },
      { status: "En attente", count: 6 },
      { status: "Annulées", count: 3 },
    ]);

    onMounted(async () => {
      try {
        const [statsRes, monthlyRes] = await Promise.all([
          fetch("http://localhost:8000/api/sales/stats").then(res => res.json()),
          fetch("http://localhost:8000/api/sales/monthly-stats").then(res => res.json()),
        ]);

        stats.value = statsRes;
        salesData.value = monthlyRes.map(item => ({
          ...item,
          sales: parseFloat(item.sales),
        }));
        console.log("Stats:", stats.value);
        console.log("SalesData:", salesData.value);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
      }
    });

    return {
      stats,
      salesData,
      ordersData,
      activeUsers,
    };
  },
};
</script>

<style scoped>
.chart {
  height: 300px;
}
</style>
