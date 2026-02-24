import { HomeView } from './components/HomeView';
import { mockPlayers } from './data/mock-players';

/** Mock용 집계 기간 (추후 API 연동 시 서버에서 계산) */
const MOCK_PERIOD_STR = '2026-02-23 (일) 오전 6시 ~ 2026-02-24 (월) 오전 6시 (KST)';

export default function HomePage() {
  return <HomeView players={mockPlayers} periodStr={MOCK_PERIOD_STR} />;
}
