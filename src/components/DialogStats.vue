<template>
  <v-dialog v-model="localVisible" max-width="400">
    <v-card>
      <v-card-title>
        Statistiques de vente
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <div v-if="isLoading" class="text-center pa-6">
          Chargement des statistiques...
        </div>
        <div v-else>
          <p>
            <strong>Tickets aujourd'hui :</strong> {{ stats.tickets_today }}
          </p>
          <p>
            <strong>Total aujourd'hui :</strong>
            {{ stats.total_today.toFixed(2) }} €
          </p>
          <p>
            <strong>Tickets cette semaine :</strong> {{ stats.tickets_week }}
          </p>
          <p>
            <strong>Total cette semaine :</strong>
            {{ stats.total_week.toFixed(2) }} €
          </p>
        </div>
      </v-card-text>
   <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="close" prepend-icon="mdi-close">
          Fermer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";

// Récupérer les props dans une variable
const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(["update:visible"]);

const localVisible = ref(false);
const stats = ref({
  tickets_today: 0,
  total_today: 0,
  tickets_week: 0,
  total_week: 0,
});
const isLoading = ref(false);

// Synchroniser le visible du parent avec localVisible local
watch(
  () => props.visible,
  (val) => {
    localVisible.value = val;
  }
);
watch(localVisible, (val) => {
  emit("update:visible", val);
});

// Fonction pour fermer
function close() {
  localVisible.value = false;
}

async function chargerStats() {
  isLoading.value = true;
  try {
    const response = await axios.get("http://localhost:8000/api/sales/stats");
    const data = response.data;
    stats.value = {
      tickets_today: parseInt(data.tickets_today) || 0,
      total_today: parseFloat(data.total_today) || 0,
      tickets_week: parseInt(data.tickets_week) || 0,
      total_week: parseFloat(data.total_week) || 0,
    };
  } catch (error) {
    console.error("Erreur chargement statistiques :", error);
    alert("Erreur chargement statistiques.");
  } finally {
    isLoading.value = false;
  }
}

// Charger stats à l'ouverture du dialog
watch(localVisible, (val) => {
  if (val) chargerStats();
});
</script>
