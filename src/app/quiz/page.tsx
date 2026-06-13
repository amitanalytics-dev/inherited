import { getSiteSettings } from '@/lib/site-settings'
import QuizClient from './QuizClient'

export default async function QuizPage() {
  const settings = await getSiteSettings()
  return <QuizClient config={settings.quiz} />
}
