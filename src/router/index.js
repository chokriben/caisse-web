import { createRouter, createWebHistory } from 'vue-router';
import Tickets from '../pages/Tickets.vue';
import TheWelcome from '../components/TheWelcome.vue'; 
import Login from '../components/Login.vue'; 
const routes = [
  { path: '/', redirect: '/welcome' }, // page d’accueil par défaut
  { path: '/welcome', name: 'TheWelcome', component: TheWelcome },
   { path: '/login', name: 'Login', component: Login },
  { path: '/tickets', name: 'Tickets', component: Tickets },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
