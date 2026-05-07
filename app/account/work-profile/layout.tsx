import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '근무 프로필 설정',
  description:
    '근무 형태와 소득 정보를 설정하여 맞춤형 한심지수 계산에 반영할 수 있습니다.',
};

export default function WorkProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
