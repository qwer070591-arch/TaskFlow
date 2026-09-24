import { test, expect } from '@playwright/test'

test('redirects to the dashboard and navigates between placeholder views', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('儀表板')

  const destinations = [
    { label: '專案', path: '/projects' },
    { label: '任務', path: '/tasks' },
    { label: '團隊', path: '/team' },
    { label: '設定', path: '/settings' },
  ]

  for (const destination of destinations) {
    await page.getByRole('link', { name: destination.label }).click()
    await expect(page).toHaveURL(new RegExp(`${destination.path}$`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(destination.label)
  }
})

test('opens and closes the mobile navigation drawer with focus restoration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/dashboard')

  const menuButton = page.getByRole('button', { name: '開啟導覽選單' })
  await menuButton.click()

  const drawer = page.getByRole('dialog', { name: '主要導覽' })
  await expect(drawer).toBeVisible()
  await expect(page.getByRole('button', { name: '關閉導覽選單' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(menuButton).toBeFocused()
})
