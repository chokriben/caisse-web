<template>
  <div>
    <h2>Clôtures de caisse</h2>
    <DxDataGrid
      :data-source="closures"
      :remote-operations="false"
      :column-auto-width="true"
      :allow-column-reordering="true"
      :row-alternation-enabled="true"
      :show-borders="true"
      :allow-column-resizing="true"
      key-expr="id"
    >
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxPager
        :allowed-page-sizes="[10, 20, 50]"
        :show-page-size-selector="true"
        :visible="true"
        display-mode="full"
        :show-info="true"
        :show-navigation-buttons="true"
      />
          <DxColumnChooser
        :enabled="true"
        :height="500"
        :width="250"
        mode="select"
      />
      <DxExport :enabled="true" />
      <DxSorting mode="single" />
      <DxColumn data-field="date" caption="Date" data-type="date" format="dd/MM/yyyy" />
      <DxColumn data-field="total_sales" caption="Total Ventes" data-type="number" format="#,##0.00" />
      <DxColumn data-field="shift" caption="Shift" data-type="string" />
      <DxColumn data-field="total_received" caption="Montant Reçu" data-type="number" format="#,##0.00" />
      <DxColumn data-field="total_change" caption="Rendu" data-type="number" format="#,##0.00" />
      <DxColumn data-field="real_cash" caption="Montant Réel" data-type="number" format="#,##0.00" />
      <DxColumn data-field="difference" caption="Différence" data-type="number" format="#,##0.00" />
      <DxColumn data-field="user.name" caption="Nom Utilisateur" data-type="string" />
    </DxDataGrid>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

import {
  DxDataGrid,
  DxColumn,
  DxFilterRow,
  DxHeaderFilter,
  DxPager,
  DxColumnChooser,
  DxExport,
  DxSorting,
} from "devextreme-vue/data-grid";

const closures = ref([]);
const loading = ref(true);

const chargerClosures = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:8000/api/closures", {
      headers: { Authorization: `Bearer ${localStorage.getItem("api_token")}` },
    });
    closures.value = response.data.closures;
    console.log("bbbbb",closures.value )
  } catch (error) {
    console.error("Erreur chargement clôtures :", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  chargerClosures();
});
</script>
