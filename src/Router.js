import VueRouter from 'vue-router';
import Home from './Pages/Home';
import Room from './Pages/Room';


const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home
    }, {
      name : "Room",
      path: '/room/:roomID',
      component: Room
    }, {
      name : "Editor",
      path: '/editor',
      component: Room
    },
    // { path: '/about', component: About }
  ]
})

export default router;
