import type { RemnawavePanelUser } from '@/lib/panel-api/remnawave'
import { Button, Image, Stack, Text } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { renderSVG } from 'uqr'

export const SubscriptionLinkWidget = ({ subscription }: { subscription: RemnawavePanelUser }) => {
  const { t } = useTranslation()
  const clipboard = useClipboard({ timeout: 10000 })

  if (!subscription) return null

  const handleCopy = () => {
    toast.success(t('subscription-link.widget.link-copied'))
    clipboard.copy(subscription.subscriptionUrl)
  }

  return (
    <>
      <Button
        onClick={() => {
          const subscriptionQrCode = renderSVG(subscription.subscriptionUrl, {
            whiteColor: '#161B22',
            blackColor: '#3CC9DB',
          })

          modals.open({
            centered: true,
            title: t('subscription-link.widget.get-link'),
            children: (
              <>
                <Stack align="center">
                  <Image
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(subscriptionQrCode)}`}
                  />
                  <Text fw={600} size="lg" ta="center">
                    {t('subscription-link.widget.scan-qr-code')}
                  </Text>
                  <Text c="dimmed" size="sm" ta="center">
                    {t('subscription-link.widget.line-1')}
                  </Text>

                  <Button fullWidth onClick={handleCopy} variant="filled">
                    {t('subscription-link.widget.copy-link')}
                  </Button>
                </Stack>
              </>
            ),
          })
        }}
        variant="outline"
      >
        {t('subscription-link.widget.get-link')}
      </Button>
    </>
  )
}
