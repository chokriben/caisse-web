<template>
  <div class="tickets-container">
    <h2>Liste des Tickets</h2>

    <!-- Skeleton loader -->
    <div v-if="loading" class="skeleton-wrapper">
      <Skeleton height="400px" />
    </div>

    <!-- DevExtreme DataGrid -->
    <DxDataGrid
      :data-source="tickets"
      :remote-operations="false"
      :column-auto-width="true"
      :allow-column-reordering="true"
      :row-alternation-enabled="true"
      :show-borders="true"
      :allow-column-resizing="true"
    >
      <!-- Tri -->
      <DxSorting mode="single" />

      <!-- Ligne de filtre -->
      <DxFilterRow :visible="true" />

      <!-- Filtres contextuels dans les en-têtes -->
      <DxHeaderFilter :visible="true" />

      <!-- Sélection -->
      <DxSelection
        mode="multiple"
        show-check-boxes-mode="always"
        select-all-mode="page"
      />

      <!-- Édition désactivée -->
      <DxEditing
        :allow-adding="false"
        :allow-updating="false"
        :allow-deleting="false"
        mode="batch"
      />

      <!-- Choix de colonnes -->
      <DxColumnChooser
        :enabled="true"
        :height="500"
        :width="250"
        mode="select"
      />

      <!-- Colonne Date -->
      <DxColumn
        data-field="created_at"
        caption="Date Création"
        data-type="date"
        format="dd/MM/yyyy"
        alignment="left"
      />

      <!-- Colonne Total -->
      <DxColumn
        data-field="total"
        caption="Total"
        data-type="number"
        :allow-editing="false"
        :allow-hiding="false"
        css-class="vertical-align"
      >
        <template #cell="{ data }"> {{ formatPrix(data.total) }} € </template>
      </DxColumn>

      <!-- Colonne Nom du Produit -->
      <DxColumn
        caption="Nom du Produit"
        data-type="string"
        cell-template="productName"
        css-class="vertical-align"
        :allow-editing="false"
      >
        <DxHeaderFilter :allow-select-all="false" />
      </DxColumn>

      <template #productName="{ data: cellData }">
        <span>{{ getProductNames(cellData.data.items) }}</span>
      </template>

      <!-- Bouton Voir détails -->
      <DxColumn caption="Détails">
        <template #cell="{ data }">
          <button class="btn-view" @click="voirDetails(data.id)">Voir</button>
        </template>
      </DxColumn>
    </DxDataGrid>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import Skeleton from "primevue/skeleton";

import {
  DxDataGrid,
  DxColumn,
  DxFilterRow,
  DxHeaderFilter,
  DxPager,
  DxColumnChooser,
  DxExport,
  DxSorting,
  DxEditing,
  DxSelection,
} from "devextreme-vue/data-grid";

export default {
  name: "ListeTickets",
  components: {
    Skeleton,
    DxDataGrid,
    DxColumn,
    DxFilterRow,
    DxHeaderFilter,
    DxPager,
    DxColumnChooser,
    DxExport,
    DxSorting,
    DxEditing,
    DxSelection,
  },
  setup() {
    const tickets = ref([]);
    const loading = ref(true);

    const chargerTickets = async () => {
      loading.value = true;
      try {
        const res = await axios.get("http://localhost:8000/api/sales");
        tickets.value = res.data;
      } catch (error) {
        alert("Erreur lors du chargement des tickets.");
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const formatPrix = (val) => {
      const n = parseFloat(val || 0);
      return n.toFixed(2).replace(/\.?0+$/, "");
    };

    const getProductNames = (items) => {
      return (
        (items || [])
          .map((item) => item.product?.name)
          .filter(Boolean)
          .join(", ") || "—"
      );
    };

    const voirDetails = (id) => {
      alert(`Voir détails du ticket ${id}`);
    };

    onMounted(() => {
      chargerTickets();
    });

    return {
      tickets,
      loading,
      formatPrix,
      getProductNames,
      voirDetails,
    };
  },
};
</script>

<style scoped>
.tickets-container {
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.btn-add-wrapper {
  margin-bottom: 1rem;
}

.card {
  margin-top: 1rem;
}

.skeleton-wrapper {
  padding: 1rem;
}

.btn-view {
  padding: 0.3rem 0.6rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.btn-view:hover {
  background-color: #0056b3;
}
</style>
