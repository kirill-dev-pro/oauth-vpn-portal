'use client'

import type { RemnawavePanelUser } from '@/lib/panel-api/remnawave'
import { Container, Group, Stack, Title } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import type { User } from 'better-auth'
import { useTranslation } from 'react-i18next'
import appsConfig from './app-config.json'
import type { IPlatformConfig } from './shared/constants/apps-config/interfaces/app-list.interface'
import { InstallationGuideWidget } from './widgets/installation-guide/installation-guide.widget'
import { SubscriptionInfoWidget } from './widgets/subscription-info/subscription-info.widget'
import { SubscriptionLinkWidget } from './widgets/subscription-link/subscription-link.widget'

import '@mantine/core/styles.css'
import I18nProvider from './i18n/i18nProvider'

export const SubViewComponent = ({
  subscription,
  user,
}: { subscription: RemnawavePanelUser; user: User }) => {
  const { t } = useTranslation()

  return (
    <I18nProvider>
      <ModalsProvider>
        <div className="max-w-[530px] self-center w-full">
          <Container my="xl" size="xl">
            <Stack gap="xl">
              <Group justify="space-between">
                <Group gap="xs">
                  <Title order={4}>{t('main.page.component.podpiska')}</Title>
                </Group>
                <Group gap="xs">
                  <SubscriptionLinkWidget subscription={subscription} />
                </Group>
              </Group>

              <Stack gap="xl">
                <SubscriptionInfoWidget subscription={subscription} user={user} />
                <InstallationGuideWidget
                  appsConfig={appsConfig as IPlatformConfig}
                  subscription={subscription}
                />
              </Stack>

              {/* <Center>
            <LanguagePicker />
          </Center> */}
            </Stack>
          </Container>
        </div>
      </ModalsProvider>
    </I18nProvider>
  )
}
