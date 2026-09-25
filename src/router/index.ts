import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import CustomerDetailView from '../views/CustomerDetailView.vue'
import CustomersView from '../views/CustomersView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import SettingsView from '../views/SettingsView.vue'
import TasksView from '../views/TasksView.vue'
import TeamView from '../views/TeamView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    { path: '/projects/:id', name: 'project-detail', component: ProjectDetailView },
    { path: '/tasks', name: 'tasks', component: TasksView },
    { path: '/team', name: 'team', component: TeamView },
    { path: '/customers', name: 'customers', component: CustomersView },
    { path: '/customers/:id', name: 'customer-detail', component: CustomerDetailView },
    { path: '/settings', name: 'settings', component: SettingsView },
  ],
})

export default router
