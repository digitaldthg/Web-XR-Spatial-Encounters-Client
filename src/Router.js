import VueRouter from 'vue-router';
import Home from './Pages/Home';
import Room from './Pages/Room';


const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/room/:roomID', component: Room },
    // { path: '/about', component: About }
  ]
})

export default router;