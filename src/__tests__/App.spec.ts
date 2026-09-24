import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '../App.vue'

describe('App', () => {
  it('renders the application shell and dashboard route', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/dashboard', component: { template: '<h1>儀表板</h1>' } }],
    })

    await router.push('/dashboard')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.get('nav[aria-label="主要導覽"]').text()).toContain('專案')
    expect(wrapper.get('h1').text()).toBe('儀表板')
  })
})
