import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 'home';
  const serviceName = searchParams.get('service');

  const titles: Record<string, { title: string; subtitle: string }> = {
    home: {
      title: 'COLOR REBEL',
      subtitle: 'BY PORSCHA',
    },
    services: {
      title: 'SERVICES',
      subtitle: 'Transform Your Look',
    },
    gallery: {
      title: 'GALLERY',
      subtitle: 'Our Work',
    },
    service: {
      title: serviceName || 'SERVICE',
      subtitle: 'Professional Hair Care',
    },
  };

  const content = titles[page] || titles.home;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
        }}
      >
        {/* Main Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 300,
              letterSpacing: '0.1em',
              color: '#fff',
              textTransform: 'uppercase',
              textShadow: '0 0 40px rgba(212, 175, 55, 0.4)',
            }}
          >
            {content.title}
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: '#d4af37',
              textTransform: 'uppercase',
            }}
          >
            {content.subtitle}
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: 28,
            color: '#fff',
            opacity: 0.8,
          }}
        >
          <span>Leavenworth, KS</span>
          <span style={{ color: '#d4af37' }}>•</span>
          <span>(913) 680-7987</span>
          <span style={{ color: '#d4af37' }}>•</span>
          <span>colorrebelbyporscha.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
