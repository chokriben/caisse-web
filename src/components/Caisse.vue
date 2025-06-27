<template>
  <div class="caisse-container">
    <!-- En-tête -->
    <header class="caisse-header">
      <div class="caisse-info">
        <h1>🛒 Point de Vente</h1>
        <p class="datetime">{{ currentDateTime }}</p>
      </div>
      <div class="caisse-user">
        <p><strong>Caisse :</strong> {{ userName || "Utilisateur" }}</p>
        <p>
          <strong>Rôle :</strong>
          <v-chip
            :color="userRole === 'admin' ? 'red darken-2' : 'blue darken-2'"
            dark
            large
          >
            {{ userRole || "Invité" }}
          </v-chip>
        </p>
        <v-btn color="red darken-2" @click="logout" large>🚪 Déconnexion</v-btn>
      </div>
    </header>

    <!-- Corps -->
    <div class="caisse-content">
      <!-- Produits -->
      <section class="produits">
        <div class="produits-header">
          <h2>🧺 Produits</h2>
          <v-btn
            v-if="userRole === 'admin'"
            color="green darken-1"
            large
            @click="showDialog = true"
          >
            ➕ Ajouter
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
            <strong>{{ formatPrix(produit.price) }}</strong>
          </button>
        </div>

        <!-- Pagination -->
        <div class="pagination-produits">
          <v-btn icon large :disabled="page <= 1" @click="page--">
            <v-icon large>mdi-chevron-left</v-icon>
          </v-btn>
          <span>Page {{ page }} / {{ totalPages }}</span>
          <v-btn icon large :disabled="page >= totalPages" @click="page++">
            <v-icon large>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </section>

      <!-- Ticket -->
      <section class="ticket">
        <h2>🧾 Ticket</h2>
        <ul>
          <li v-for="(item, index) in ticket" :key="index">
            <div style="flex: 1">
              <strong>{{ item.name }}</strong
              ><br />
              <small
                >{{ formatPrix(item.price) }} x {{ item.quantite }} =
                {{ formatPrix(item.price * item.quantite) }}</small
              >
            </div>
            <div class="actions">
              <v-btn icon @click="decrementQuantite(index)"
                ><v-icon>mdi-minus</v-icon></v-btn
              >
              <span>{{ item.quantite }}</span>
              <v-btn icon @click="incrementQuantite(index)"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
              <v-btn icon color="red" @click="retirerDuTicket(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>
          </li>
        </ul>
        <div class="total">
          Total : <strong>{{ formatPrix(total) }}</strong>
        </div>
        <!-- Paiement -->
        <div class="zone-paiement">
          <label for="montantRecu">💰 Montant reçu</label>
          <input
            id="montantRecu"
            type="number"
            v-model.number="montantRecu"
            placeholder="0.00"
          />
          <label for="modePaiement">🧾 Mode de Paiement</label>
          <select v-model="modePaiement" id="modePaiement">
            <option value="especes">Espèces</option>
            <option value="carte">Carte</option>
            <option value="cheque">Chèque</option>
            <option value="mobile">Mobile Money</option>
          </select>
          <p>
            💵 Montant Rendu : <strong>{{ formatPrix(renduMonnaie) }}</strong>
          </p>
        </div>
        <v-btn
          class="payer-btn"
          :disabled="isLoading || ticket.length === 0"
          @click="validerTicket"
          color="green darken-2"
          tile
        >
          💵<br />
          <strong>{{ isLoading ? "Traitement..." : "Valider" }}</strong>
        </v-btn>
      </section>

      <!-- Actions verticales -->
      <section class="actions-verticales">
        <v-btn
          large
          color="blue darken-2"
          @click="imprimerTicket"
          :disabled="ticket.length === 0"
        >
          🖨️ Imprimer Ticket
        </v-btn>
        <div class="clavier-wrapper">
          <add-clavier @ajout="gererClavier" />
        </div>
        <v-btn
          large
          v-if="userRole === 'admin'"
          color="indigo"
          @click="showStatsDialog = true"
        >
          📊 Voir les statistiques
        </v-btn>

        <v-btn
          large
          v-if="userRole === 'caisser'"
          color="orange"
          @click="imprimerTicketX"
        >
          🧾 Ticket X
        </v-btn>

        <v-btn
          large
          v-if="userRole === 'admin'"
          color="red"
          @click="imprimerTicketZ"
        >
          🚫 Clôturer - Ticket Z
        </v-btn>

        <v-btn
          large
          v-if="userRole === 'admin'"
          color="primary"
          @click="goToTickets"
        >
          📋 Historique Tickets
        </v-btn>
      </section>
    </div>

    <!-- Dialogs -->
    <dialog-add-produit
       v-if="userRole === 'admin'"
      :visible="showDialog"
      @update:visible="showDialog = $event"
      @dataChanged="chargerProduits"
    />
    <dialog-stats
      :visible="showStatsDialog"
      @update:visible="showStatsDialog = $event"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import DialogAddProduit from "../components/DialogAddProduit.vue";
import DialogStats from "../components/DialogStats.vue";
import AddClavier from "../components/AddClavier.vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
export default {
  components: {
    DialogAddProduit,
    DialogStats,
    AddClavier,
  },
  setup() {
    const produits = ref([]);
    const ticket = ref([]);
    const montantRecu = ref(0);
    const isLoading = ref(false);
    const showDialog = ref(false);
    const showStatsDialog = ref(false);
    const modePaiement = ref("especes");

    const router = useRouter();
    // State pour user info
    const userName = ref("");
    const userRole = ref("");

    const retirerDuTicket = (index) => {
      if (confirm(`Supprimer "${ticket.value[index].name}" du ticket ?`)) {
        ticket.value.splice(index, 1);
      }
    };
    const goToTickets = () => {
      router.push("/tickets");
    };
    const gererClavier = (val) => {
      const current = montantRecu.value.toString();

      if (val === "⌫") {
        montantRecu.value = parseFloat(current.slice(0, -1)) || 0;
      } else if (val === "C") {
        montantRecu.value = 0;
      } else {
        const nouveau = current === "0" ? val : current + val;
        montantRecu.value = parseFloat(nouveau);
      }
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
      modePaiement.value = "especes";
    };

    const validerTicket = async () => {
      if (total.value === 0) {
         toast.info("Aucun article sélectionné.");
        return;
      }

      if (montantRecu.value < total.value) {
         toast.info("Le montant reçu est insuffisant !");
        return;
      }

      isLoading.value = true;

      try {
        const vente = {
          total: total.value,
          received: montantRecu.value,
          change: renduMonnaie.value,
          mode: modePaiement.value,
          items: ticket.value.map((item) => ({
            product_id: item.id,
            quantity: item.quantite,
            price: item.price,
          })),
        };

        console.log("ccc", vente);
        await axios.post("http://localhost:8000/api/sales", vente);
       // alert("Paiement effectué avec succès !");
     toast.success("Paiement effectué avec succès ");
        // Réinitialisation
        ticket.value = [];
        montantRecu.value = 0;
        modePaiement.value = "especes";
      } catch (error) {
        console.error(error);
        alert("Erreur lors de l'enregistrement de la vente.");
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(async () => {
      setInterval(() => {
        const now = new Date();
        currentDateTime.value = now.toLocaleString("fr-FR");
      }, 1000);
      await chargerProduits();
      userName.value = localStorage.getItem("user_name") || "Utilisateur";
      userRole.value = localStorage.getItem("user_role") || "Invité";
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
    const logout = () => {
      localStorage.removeItem("api_token"); // Supprime le token
      router.push("/"); // Redirige vers la page de login
      location.reload(); // Recharge la page pour réinitialiser les états
    };
    const incrementQuantite = (index) => {
      ticket.value[index].quantite++;
    };

    const decrementQuantite = (index) => {
      if (ticket.value[index].quantite > 1) {
        ticket.value[index].quantite--;
      } else {
        retirerDuTicket(index);
      }
    };

    return {
      produits,
      ticket,
      montantRecu,
      total,
      logout,
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
      userName,
      userRole,
      incrementQuantite,
      decrementQuantite,
      modePaiement,
      gererClavier,
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
  background: #004d40;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.5rem;
}
.caisse-header .datetime {
  font-size: 1.2rem;
  margin-top: 5px;
}
.caisse-user {
  text-align: right;
}

.zone-paiement {
  margin-top: 1rem;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.zone-paiement .clavier-wrapper {
  margin-top: 1rem;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}

.ticket ul li {
  font-size: 1.3rem;
}

.v-btn {
  font-size: 1.2rem !important;
}
.caisse-content {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}
.produits,
.ticket {
  flex: 1;
  margin-bottom: 1rem;
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 8px;
}
.produits-liste {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 550px;
  overflow-y: auto;
}

.produit-btn {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  width: 140px;
  height: 120px;
  font-size: 1.3rem;
  background: #dff0d8;
}
.produit-btn:hover {
  background: #d1d1d1;
}
.ticket ul {
  border: 1px solid #ddd;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 1rem;
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
  width: 100%;
  height: 140px;
  font-size: 1.6rem;
  font-weight: bold;
  background: #28a745;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
  padding: 1rem;
}
.payer-btn:hover {
  background: #218838;
}
.payer-btn:disabled {
  background: #a9a9a9;
  cursor: not-allowed;
}

.stats {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.actions-verticales {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  max-width: 250px;
}
.ticket ul li {
  background-color: #ffffff;
  padding: 10px 15px;
  margin-bottom: 8px;
  border-radius: 6px;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.zone-paiement select {
  font-size: 1.1rem;
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
/* Alternance de couleur (zébré) */
.ticket ul li:nth-child(odd) {
  background-color: #e6f7ff;
}

.ticket ul li:nth-child(even) {
  background-color: #f9f9f9;
}

.ticket ul li:hover {
  background-color: #d0ebff;
}
.zone-paiement add-clavier {
  margin-top: 0.5rem;
  display: block;
}
.clavier-wrapper {
  padding: 0.5rem;
  border-radius: 8px;
  background: #f0f0f0;
  margin-top: 0.5rem;
}
</style>
