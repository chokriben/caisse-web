import { createRouter, createWebHistory } from 'vue-router';

// Import des composants/pages
import Tickets from '../pages/Tickets.vue';
import Caisse from '../components/Caisse.vue';
import Login from '../components/Login.vue';

// Import du layout Admin et ses pages enfants
import AdminLayout from '../layouts/AdminLayout.vue';
import Users from '../pages/admin/Users.vue';
import Produits from '../pages/Produits.vue';
import AdminDashboard from '../pages/admin/AdminDashboard.vue';
import Settings from '../pages/admin/Settings.vue';
import ClotureCaisse from '../pages/admin/ClotureCaisse.vue'; 
import Closures from '../pages/admin/Closures.vue'; 
const routes = [
  // Page d'accueil redirige vers la caisse
  { path: '/', redirect: '/caisse' },

  // Pages publiques
  { path: '/caisse', name: 'Caisse', component: Caisse },
  { path: '/login', name: 'Login', component: Login },

  // Routes admin sous layout AdminLayout
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/dashboard' }, // Redirection par défaut

      {
        path: 'dashboard',  // url = /admin/dashboard
        name: 'AdminDashboard',
        component: AdminDashboard,
      },
      {
        path: 'tickets',    // url = /admin/tickets
        name: 'Tickets',
        component: Tickets,
      },
      {
        path: 'users',      // url = /admin/users
        name: 'AdminUsers',
        component: Users,
      },
      {
        path: 'produits',      // url = /admin/users
        name: 'Produits',
        component: Produits,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      },
      {
        path: 'cloture',
        name: 'ClotureCaisse',
        component: ClotureCaisse, // ✅ Composant à créer/importer
      },
      {
        path: 'closures',
        name: 'Closures',
        component: Closures, // ✅ Composant à créer/importer
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
