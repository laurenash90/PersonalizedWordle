import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import HelloWordle from './components/HelloWordle.vue'
import SignUp from './components/SignUp.vue'
import Login from './components/Login.vue'
import GameStats from './components/GameStats.vue'

// Define routes and navigation paths
const myComponentRoutes = [
  { path: "/", component: Login },
  { path: "/game", component: HelloWordle },
  { path: "/signup", component: SignUp },
  { path: "/stats", component: GameStats },
];

const myRouter = createRouter({
  history: createWebHashHistory(),
  routes: myComponentRoutes
});

// Use the router with VueJS app
createApp(App)
  .use(myRouter)
  .mount("#app");

