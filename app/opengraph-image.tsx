import { ImageResponse } from 'next/og';

/** OG 이미지 — Downloads/og-image.html 레이아웃을 next/og(Satori)로 이식 */
export const alt = '한심지수 - HanSim Level Score';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NOTO_KR_800 =
  'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.0.18/files/noto-sans-kr-korean-800-normal.woff';
/** Satori는 wOF2 시그니처를 지원하지 않아 Manrope는 TTF 사용 */
const MANROPE_TTF =
  'https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk59E-_F.ttf';

async function loadFonts() {
  const [notoBuf, manropeBuf] = await Promise.all([
    fetch(NOTO_KR_800).then((r) => r.arrayBuffer()),
    fetch(MANROPE_TTF).then((r) => r.arrayBuffer()),
  ]);

  const notoWeights = [500, 600, 700, 800] as const;
  const notoFonts = notoWeights.map((weight) => ({
    name: 'Noto Sans KR',
    data: notoBuf,
    style: 'normal' as const,
    weight,
  }));

  const manropeWeights = [500, 600, 700, 800] as const;
  const manropeFonts = manropeWeights.map((weight) => ({
    name: 'Manrope',
    data: manropeBuf,
    style: 'normal' as const,
    weight,
  }));

  return [...notoFonts, ...manropeFonts];
}

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#F5F6F7',
          fontFamily: '"Noto Sans KR", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(107, 254, 156, 0.15) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 80,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 42,
                fontWeight: 800,
                color: '#CDFFD4',
                background: 'linear-gradient(135deg, #006A35 0%, #005C2D 100%)',
                boxShadow: '0 8px 24px rgba(0, 106, 53, 0.2)',
              }}
            >
              한
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: '#2C2F30',
                  letterSpacing: -0.5,
                }}
              >
                한심지수
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: '#595C5D',
                  letterSpacing: 0.5,
                  fontFamily: 'Manrope, "Noto Sans KR", sans-serif',
                }}
              >
                HANSIM LEVEL SCORE
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 40,
              marginTop: -40,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 52,
                fontWeight: 700,
                color: '#2C2F30',
                lineHeight: 1.3,
                maxWidth: 900,
              }}
            >
              <div>퇴근은 했지만,</div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                <span>현실은 </span>
                <span style={{ color: '#006A35', fontWeight: 800 }}>대기열</span>
                <span>에.</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 32,
                  padding: '24px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#595C5D',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  오늘의 HLS
                </div>
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    color: '#006A35',
                    lineHeight: 1,
                  }}
                >
                  87
                </div>
              </div>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 32,
                  padding: '24px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#595C5D',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  어제 밤
                </div>
                <div
                  style={{
                    fontSize: 64,
                    fontWeight: 800,
                    color: '#006A35',
                    lineHeight: 1,
                  }}
                >
                  42
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                background: '#E6E8EA',
                color: '#595C5D',
                padding: '12px 24px',
                borderRadius: 9999,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              24시간 LoL 행태 분석
            </div>
            <div
              style={{
                background: '#E6E8EA',
                color: '#595C5D',
                padding: '12px 24px',
                borderRadius: 9999,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              그룹 랭킹
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#006A35',
                fontFamily: 'Manrope, "Noto Sans KR", sans-serif',
              }}
            >
              hansim.site
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 80,
            width: 400,
            height: 400,
            opacity: 0.08,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'repeating-linear-gradient(45deg, #006A35, #006A35 2px, transparent 2px, transparent 12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 180,
            }}
          >
            🎮
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
