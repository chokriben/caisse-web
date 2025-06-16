<template>
  <div class="tickets-container">
    <h2>Liste des Tickets</h2>

    <!-- Bouton pour ajouter un produit -->
    <div class="btn-add-wrapper">
      <v-btn color="primary" @click="showDialog = true">
        Ajouter un Produit
      </v-btn>
    </div>

    <!-- Skeleton loader -->
    <div v-if="loading" class="skeleton-wrapper">
      <Skeleton height="400px" />
    </div>

    <!-- DevExtreme DataGrid -->
    <div v-else class="card">
      <DxDataGrid
        :data-source="tickets"
        :column-auto-width="true"
        :show-borders="true"
        :row-alternation-enabled="true"
        :allow-column-resizing="true"
        height="500px"
        key-expr="id"
      >
        <!-- Tri -->
        <DxSorting mode="single" />

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
        <DxColumnChooser :enabled="true" :height="500" :width="250" mode="select" />

        <!-- Colonne Date -->
        <DxColumn data-field="created_at" caption="Date" data-type="date">
          <template #cell="{ data }">
            {{ formatDate(data.created_at) }}
          </template>
        </DxColumn>

        <!-- Colonne Total -->
        <DxColumn
          data-field="total"
          caption="Total"
          data-type="number"
          :allow-editing="false"
          :allow-hiding="false"
          css-class="vertical-align"
        >
          <template #cell="{ data }">
            {{ formatPrix(data.total) }} €
          </template>
        </DxColumn>

        <!-- Colonne Nom du Produit avec template -->
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

    <!-- Dialog pour ajouter produit -->
    <dialog-add-produit
      :visible="showDialog"
      @update:visible="showDialog = $event"
      @dataChanged="chargerTickets"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Skeleton from 'primevue/skeleton';
import DialogAddProduit from "../components/DialogAddProduit.vue";

import DxDataGrid, {
  DxColumn,
  DxSorting,
  DxEditing,
  DxSelection,
  DxColumnChooser,
  DxHeaderFilter,
} from "devextreme-vue/data-grid";

const tickets = ref([]);
const loading = ref(true);
const showDialog = ref(false);

// Chargement des tickets
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

// Formatage des données
const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

const formatPrix = (val) => {
  const n = parseFloat(val || 0);
  return n.toFixed(2).replace(/\.?0+$/, "");
};

const getProductNames = (items) => {
  return (items || [])
    .map(item => item.product?.name)
    .filter(Boolean)
    .join(", ") || "—";
};

const voirDetails = (id) => {
  alert(`Voir détails du ticket ${id}`);
};

onMounted(() => {
  chargerTickets();
});
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
