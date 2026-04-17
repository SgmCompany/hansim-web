import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function DELETE() {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    // TODO: 실제 DB에서 사용자 데이터 삭제
    // await db.user.delete({ where: { id: session.user.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('회원탈퇴 오류:', error);
    return NextResponse.json({ error: '회원탈퇴 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
