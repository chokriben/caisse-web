<template>
  <!-- En-tête -->
  <div class="p-mb-3 p-d-flex p-jc-between p-flex-column p-flex-sm-row">
    <div class="title">Produits</div>
    <!-- Bouton pour ajouter un produit -->
    <div class="btn-add-wrapper">
      <v-btn color="primary" @click="ouvrirDialogAjout">
        Ajouter un Produit
      </v-btn>
    </div>
  </div>

  <!-- Loader Skeleton -->
  <div v-if="loading" class="box">
    <div class="p-d-flex p-jc-between p-mx-2">
      <div class="p-d-flex p-mb-2">
        <Skeleton size="2.5rem" class="p-mr-2"></Skeleton>
      </div>
      <div class="p-d-flex">
        <Skeleton size="2.5rem" class="p-mr-2"></Skeleton>
        <Skeleton size="2.5rem" class="p-mr-2"></Skeleton>
        <Skeleton size="2.5rem" class="p-mr-2"></Skeleton>
        <Skeleton size="2.5rem" class="p-mr-2"></Skeleton>
      </div>
    </div>
    <Skeleton height="75%"></Skeleton>
  </div>

  <!-- Tableau produits -->
  <div class="card" v-else>
    <DxDataGrid
      :data-source="products"
      :remote-operations="false"
      :column-auto-width="true"
      :allow-column-reordering="true"
      :row-alternation-enabled="true"
      :show-borders="true"
      :allow-column-resizing="true"
    >
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxPager
        :allowed-page-sizes="[10, 15, 20, 50]"
        :show-page-size-selector="true"
        :visible="true"
        display-mode="full"
        :show-info="true"
        :show-navigation-buttons="true"
      />
      <DxColumnChooser :enabled="true" />
      <DxExport :enabled="true" />
      <DxSorting mode="single" />
      <DxEditing
        :allow-adding="false"
        :allow-deleting="false"
        :allow-updating="false"
        mode="batch"
      />
      <DxSelection
        show-check-boxes-mode="always"
        mode="multiple"
        select-all-mode="page"
      />

      <DxColumn
        data-field="name"
        caption="Nom"
        data-type="string"
        :allow-editing="false"
      />
      <DxColumn
        data-field="price"
        caption="Prix"
        data-type="number"
        format="#,##0.00"
        alignment="left"
        :allow-editing="false"
      />
      <DxColumn
        data-field="created_at"
        caption="Date création"
        data-type="date"
        format="dd/MM/yyyy"
        alignment="left"
      />
      <DxColumn
        data-field="updated_at"
        caption="Date Mise A jour"
        data-type="date"
        format="dd/MM/yyyy"
        alignment="left"
      />
      <DxColumn caption="Actions" :width="150" cell-template="actionCell" />
      <template #actionCell="{ data: row }">
        <span
          @click="editerProduit(row)"
          style="cursor: pointer; margin-right: 10px"
        >
          <v-icon color="primary" small>mdi-pencil</v-icon>
        </span>
        <span @click="supprimerProduit(row)" style="cursor: pointer">
          <v-icon color="red" small>mdi-delete</v-icon>
        </span>
      </template>
    </DxDataGrid>
    <dialog-add-produit
      :visible="showDialog"
      :produit="produitActuel"
      :is-edit-mode="isEditMode"
      @update:visible="showDialog = $event"
      @dataChanged="
        () => {
          produitActuel = null;
          chargerProduits();
        }
      "
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import DialogAddProduit from "../components/DialogAddProduit.vue";

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
  components: {
    DialogAddProduit,
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
    const products = ref([]);
    const loading = ref(true);
    const showDialog = ref(false);
    const produitActuel = ref(null);
    const isEditMode = ref(false); // <-- mode édition

    const editerProduit = (row) => {
      isEditMode.value = true;
      // Ne passer que name et price dans produitActuel
      produitActuel.value = {
        name: row.data.name,
        price: row.data.price,
        id: row.data.id, // utile si tu veux modifier sur API
      };
      showDialog.value = true;
    };

    const chargerProduits = async () => {
      loading.value = true;
      try {
        const response = await axios.get("http://localhost:8000/api/products");
        products.value = response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      chargerProduits();
    });

    const supprimerProduit = async (row) => {
      const produit = row.data;
      if (confirm(`Supprimer le produit "${produit.name}" ?`)) {
        try {
          await axios.delete(
            `http://localhost:8000/api/products/${produit.id}`
          );
          chargerProduits();
        } catch (error) {
          console.error("Erreur suppression produit :", error);
        }
      }
    };

    // Quand on ouvre le dialog en mode "ajout"
    const ouvrirDialogAjout = () => {
      isEditMode.value = false;
      produitActuel.value = null;
      showDialog.value = true;
    };

    return {
      products,
      supprimerProduit,
      loading,
      showDialog,
      chargerProduits,
      editerProduit,
      produitActuel,
      isEditMode,
      ouvrirDialogAjout,
    };
  },
};
</script>
