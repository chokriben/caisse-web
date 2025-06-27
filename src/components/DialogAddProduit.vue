<template>
  <v-dialog v-model="localVisible" max-width="700px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h6">
          {{ isEditMode ? "Modifier le produit" : "Ajouter un produit" }}
        </span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form @submit.prevent="submitForm" ref="formRef">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Nom *"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.price"
                label="Prix *"
                type="number"
                required
                min="0"
                step="0.01"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row justify="end" class="mt-4">
            <v-btn
              color="success"
              class="mr-2"
              type="submit"
              prepend-icon="mdi-check"
            >
              {{ isEditMode ? "Mettre à jour" : "Ajouter" }}
            </v-btn>
            <v-btn
              color="secondary"
              @click="fermerPopup"
              prepend-icon="mdi-close"
            >
              Annuler
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, computed } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    produit: {
      type: Object,
      default: null,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:visible", "dataChanged", "fermer"],
  setup(props, { emit }) {
    const localVisible = ref(props.visible);

    // Formulaire réactif
    const form = ref({
      id: null,
      name: "",
      price: null,
    });

    // Computed mode édition basé sur la prop
    const isEditMode = computed(() => props.isEditMode);

    // Reset form
    const resetForm = () => {
      form.value = {
        id: null,
        name: "",
        price: null,
      };
    };

    // Synchronisation du v-model localVisible avec la prop visible
    watch(
      () => props.visible,
      (newVal) => {
        localVisible.value = newVal;
      }
    );

    // Quand localVisible change (ex: fermeture), on notifie le parent
    watch(localVisible, (newVal) => {
      emit("update:visible", newVal);
      if (!newVal) {
        resetForm();
      }
    });

    // Quand la prop produit change, on met à jour le formulaire
    watch(
      () => props.produit,
      (newProduit) => {
        if (newProduit) {
          form.value = {
            id: newProduit.id || null,
            name: newProduit.name || "",
            price: newProduit.price || null,
          };
        } else {
          resetForm();
        }
      },
      { immediate: true }
    );

    const fermerPopup = () => {
      localVisible.value = false;
      emit("fermer");
    };

    const submitForm = async () => {
      if (
        !form.value.name ||
        form.value.price === null ||
        form.value.price === ""
      ) {

             toast.error("Veuillez remplir les champs obligatoires : nom et prix. ");
        return;
      }

      try {
        if (isEditMode.value) {
          console.log("fffff",isEditMode.value)
          // Mode édition
          await axios.put(
            `http://127.0.0.1:8000/api/products/${form.value.id}`,
            {
              name: form.value.name,
              price: form.value.price,
            }
          );
        } else {
          // Mode ajout
           console.log("fffff",isEditMode.value)
          await axios.post("http://127.0.0.1:8000/api/products", {
            name: form.value.name,
            price: form.value.price,
          });
        }
        emit("dataChanged");
        fermerPopup();
      } catch (err) {
        console.error("Erreur lors de l’enregistrement :", err);
        alert("Une erreur est survenue lors de l'enregistrement du produit.");
      }
    };

    return {
      localVisible,
      form,
      fermerPopup,
      submitForm,
      isEditMode,
    };
  },
};
</script>
