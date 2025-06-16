<template>
  <div class="caisse-container">
    <!-- En-tête -->
    <header class="caisse-header">
      <h2>Point de Vente</h2>
      <p>{{ new Date().toLocaleString() }}</p>
    </header>

    <div class="caisse-content">
      <!-- Liste des produits -->
      <section class="produits">
        <h3>Produits</h3>
        <div
          style="display: flex; justify-content: flex-end; margin-bottom: 1rem"
        >
          <v-btn
            color="success"
            class="mr-2"
            type="button"
            prepend-icon="mdi-check"
            @click="showDialog = true"
          >
            Ajouter
          </v-btn>
        </div>

        <div class="produits-liste">
          <button
            v-for="produit in produitsPage"
            :key="produit.id"
            class="produit-btn"
            @click="ajouterAuTicket(produit)"
          >
            {{ produit.name }}<br />
            <strong>{{ formatPrix(produit.price) }} </strong>
          </button>
        </div>

        <!-- Pagination -->
        <div
          class="pagination-produits"
          style="margin-top: 1rem; text-align: center"
        >
          <v-btn icon :disabled="page <= 1" @click="page--" color="primary">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <span> Page {{ page }} / {{ totalPages }} </span>

          <v-btn
            icon
            :disabled="page >= totalPages"
            @click="page++"
            color="primary"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </section>

      <!-- Ticket -->
      <section class="ticket">
        <h3>Ticket</h3>
        <ul>
          <li
            v-for="(item, index) in ticket"
            :key="index"
            @click="retirerDuTicket(index)"
            style="cursor: pointer; user-select: none"
            title="Cliquer pour supprimer cet article du ticket"
          >
            {{ item.name }} x{{ item.quantite }} -
            {{ formatPrix(item.price * item.quantite) }}
          </li>
        </ul>

        <div class="total">
          Total : <strong>{{ formatPrix(total) }} </strong>
        </div>

        <!-- Zone paiement -->
        <div class="zone-paiement">
          <label for="montantRecu">Montant reçu </label>
          <input
            id="montantRecu"
            type="number"
            v-model.number="montantRecu"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          <p>
            Montant Rendu : <strong>{{ formatPrix(renduMonnaie) }} </strong>
          </p>
        </div>

        <button
          class="payer-btn"
          @click="validerTicket"
          :disabled="isLoading || ticket.length === 0"
        >
          {{ isLoading ? "Traitement..." : "VALIDER TICKET" }}
        </button>

        <v-btn
          color="success"
          class="mt-2"
          block
          @click="imprimerTicket"
          :disabled="ticket.length === 0"
        >
          Imprimer Ticket
        </v-btn>
      </section>
      <section>
        <v-btn color="info" @click="showStatsDialog = true">
          Voir les statistiques
        </v-btn>
      </section>
      <section style="margin-top: 1rem; display: flex; gap: 1rem">
        <v-btn color="warning" @click="imprimerTicketX">
          Imprimer Ticket X
        </v-btn>
        <v-btn color="error" @click="imprimerTicketZ">
          Clôturer avec Ticket Z
        </v-btn>
      </section>
      <section style="margin-top: 1rem">
        <v-btn color="primary" @click="goToTickets"> Tickets </v-btn>
      </section>
    </div>
  </div>
  <dialog-add-produit
    :visible="showDialog"
    @update:visible="showDialog = $event"
    @dataChanged="chargerProduits"
  />
  <dialog-stats
    :visible="showStatsDialog"
    @update:visible="showStatsDialog = $event"
  />
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import DialogAddProduit from "../components/DialogAddProduit.vue";
import DialogStats from "../components/DialogStats.vue";
import { useRouter } from "vue-router";
export default {
  components: {
    DialogAddProduit,
    DialogStats,
  },
  setup() {
    const produits = ref([]);
    const ticket = ref([]);
    const montantRecu = ref(0);
    const isLoading = ref(false);
    const showDialog = ref(false);
    const showStatsDialog = ref(false);
    const router = useRouter();
    const retirerDuTicket = (index) => {
      if (confirm(`Supprimer "${ticket.value[index].name}" du ticket ?`)) {
        ticket.value.splice(index, 1);
      }
    };
    const goToTickets = () => {
      router.push("/tickets");
    };

    const formatPrix = (value) => {
      const n = parseFloat(value || 0);
      return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2).replace(/\.?0+$/, "");
    };
    const page = ref(1);
    const itemsPerPage = 10;

    const produitsPage = computed(() => {
      const start = (page.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return produits.value.slice(start, end);
    });

    const totalPages = computed(() =>
      Math.ceil(produits.value.length / itemsPerPage)
    );

    const chargerProduits = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products");
        produits.value = response.data;
      } catch (error) {
        console.error("Erreur chargement produits :", error);
        alert("Erreur chargement produits depuis le serveur");
      }
    };

    const total = computed(() =>
      ticket.value.reduce((sum, item) => sum + item.price * item.quantite, 0)
    );

    const renduMonnaie = computed(() =>
      montantRecu.value > total.value ? montantRecu.value - total.value : 0
    );

    const ajouterAuTicket = (produit) => {
      const existant = ticket.value.find((item) => item.id === produit.id);
      if (existant) {
        existant.quantite++;
      } else {
        ticket.value.push({
          id: produit.id,
          name: produit.name,
          price: parseFloat(produit.price),
          quantite: 1,
        });
      }
    };

    const imprimerTicket = () => {
      if (ticket.value.length === 0) {
        alert("Aucun ticket à imprimer.");
        return;
      }

      const date = new Date();
      const lignes = ticket.value
        .map(
          (item) =>
            `${item.name} x${item.quantite} - ${formatPrix(
              item.price
            )} = ${formatPrix(item.quantite * item.price)}`
        )
        .join("<br>");
      const ticketHtml = `
    <html>
      <head>
        <style>
          body { font-family: monospace; padding: 10px; }
          h2 { text-align: center; }
          .total { margin-top: 10px; font-size: 16px; }
          .footer { margin-top: 20px; text-align: center; font-style: italic; }
        </style>
      </head>
      <body>
        <h2>🧾 Ticket de Cisse 🧾</h2>
        <p>Date : ${date.toLocaleString()}</p>
        <hr>
        ${lignes}
        <hr>
        <div class="total">
          <p>Total : ${formatPrix(total.value)}</p>
          <p>Montant Reçu : ${formatPrix(montantRecu.value)} </p>
          <p>Monnaie Rendue : ${formatPrix(renduMonnaie.value)} </p>
        </div>
        <div class="footer">
          Merci pour votre achat !<br>
          À bientôt chez Cisse
        </div>
      </body>
    </html>
  `;

      const printWindow = window.open("", "_blank", "width=400,height=600");
      printWindow.document.write(ticketHtml);
      printWindow.document.close();
      printWindow.print();

      // Optionnel : réinitialiser après impression
      ticket.value = [];
      montantRecu.value = 0;
    };

    const validerTicket = async () => {
      if (total.value === 0) {
        alert("Aucun article sélectionné.");
        return;
      }

      if (montantRecu.value < total.value) {
        alert("Le montant reçu est insuffisant !");
        return;
      }

      isLoading.value = true;

      try {
        const vente = {
          total: total.value,
          received: montantRecu.value,
          change: renduMonnaie.value,
          items: ticket.value.map((item) => ({
            product_id: item.id,
            quantity: item.quantite,
            price: item.price,
          })),
        };

        console.log("ccc", vente);
        await axios.post("http://localhost:8000/api/sales", vente);
        alert("Paiement effectué avec succès !");

        // Réinitialisation
        ticket.value = [];
        montantRecu.value = 0;
      } catch (error) {
        console.error(error);
        alert("Erreur lors de l'enregistrement de la vente.");
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(async () => {
      await chargerProduits();
    });
    const imprimerTicketX = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/sales/stats"
        ); // À adapter selon ton backend
        const stats = response.data;

        const html = `
      <html>
        <head>
          <style>
            body { font-family: monospace; padding: 10px; }
            h2 { text-align: center; }
            .total { font-size: 16px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h2>📋 Ticket X - Aperçu</h2>
          <p>Date : ${new Date().toLocaleString()}</p>
          <hr>
          <p>Tickets aujourd'hui : ${stats.tickets_today}</p>
          <p>Total aujourd'hui : ${parseFloat(stats.total_today).toFixed(
            2
          )} </p>
          <p>Tickets cette semaine : ${stats.tickets_week}</p>
          <p>Total cette semaine : ${parseFloat(stats.total_week).toFixed(
            2
          )} </p>
          <hr>
          <p style="text-align: center;">Ce ticket est un aperçu - aucune donnée n’a été modifiée.</p>
        </body>
      </html>
    `;

        const printWindow = window.open("", "_blank", "width=400,height=600");
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      } catch (error) {
        console.error("Erreur ticket X", error);
        alert("Impossible de générer le ticket X");
      }
    };

    const imprimerTicketZ = async () => {
      if (!confirm("Es-tu sûr de vouloir clôturer la journée ?")) return;

      try {
        const response = await axios.post(
          "http://localhost:8000/api/sales/close-day"
        );
        const result = response.data;

        const html = `
      <html>
        <head>
          <style>
            body { font-family: monospace; padding: 10px; }
            h2 { text-align: center; color: red; }
            .total { font-size: 16px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h2>🧾 Ticket Z - Clôture Journée</h2>
          <p>Date : ${new Date().toLocaleString()}</p>
          <hr>
          <p>Total des ventes : ${parseFloat(result.total).toFixed(2)} </p>
          <p>Nombre de tickets : ${result.ticket_count}</p>
          <hr>
          <p style="text-align: center;">Fin de journée clôturée. Compteurs réinitialisés.</p>
        </body>
      </html>
    `;

        const printWindow = window.open("", "_blank", "width=400,height=600");
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      } catch (error) {
        console.error("Erreur ticket Z", error);
        alert("Erreur lors de la clôture de la journée.");
      }
    };

    return {
      produits,
      ticket,
      montantRecu,
      total,
      renduMonnaie,
      ajouterAuTicket,
      validerTicket,
      isLoading,
      showDialog,
      chargerProduits,
      showStatsDialog,
      imprimerTicketX,
      imprimerTicketZ,
      formatPrix,
      totalPages,
      produitsPage,
      page,
      imprimerTicket,
      retirerDuTicket,
      goToTickets,
      router,
    };
  },
};
</script>

<style scoped>
.caisse-container {
  font-family: Arial, sans-serif;
  padding: 1rem;
}
.caisse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.caisse-content {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}
.produits,
.ticket {
  flex: 1;
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 8px;
}
.produits-liste {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.produit-btn {
  padding: 1rem;
  background: #e3e3e3;
  border: none;
  border-radius: 8px;
  width: 100px;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
}
.produit-btn:hover {
  background: #d1d1d1;
}
.ticket ul {
  list-style: none;
  padding: 0;
}
.total {
  margin-top: 1rem;
  font-size: 1.2rem;
}
.zone-paiement {
  margin-top: 1rem;
}
.zone-paiement input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  margin-top: 0.3rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.zone-paiement p {
  margin-top: 0.5rem;
  font-weight: bold;
  font-size: 1.1rem;
}
.payer-btn {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  background: green;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}
.payer-btn:hover {
  background: darkgreen;
}
.stats {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>
