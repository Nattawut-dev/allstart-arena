import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="th">
      <Head>
        {/* Title & Meta Description */}
        <meta name="description" content="จองสนามแบดมินตันที่ดีที่สุดในเชียงราย สมัครแข่งแบด ตีแบดบุฟเฟ่ต์ ครบจบในที่เดียว All Stars Arena เชียงราย" />
        <meta name="keywords" content="จองสนามแบดมินตัน เชียงราย, สนามแบด เชียงราย, ออลสตา เชียงราย, ออลสตาแบดมินตัน, สนามแบดมินตัน เชียงราย, ตีแบด เชียงราย, สมัครแข่งแบด เชียงราย, บุฟเฟ่ต์แบดมินตัน เชียงราย, All Stars Arena, allstars arena เชียงราย" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="จองสนามแบดมินตัน เชียงราย | All Stars Arena" />
        <meta property="og:description" content="จองสนามแบดมินตันที่ดีที่สุดในเชียงราย สมัครแข่งแบด ตีแบดบุฟเฟ่ต์ ครบจบในที่เดียว All Stars Arena เชียงราย" />
        <meta property="og:image" content="https://www.allstarsarena.com/logo.jpg" />
        <meta property="og:url" content="https://www.allstarsarena.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="จองสนามแบดมินตัน เชียงราย | All Stars Arena" />
        <meta name="twitter:description" content="จองสนามแบดมินตันที่ดีที่สุดในเชียงราย สมัครแข่งแบด ตีแบดบุฟเฟ่ต์ ครบจบในที่เดียว All Stars Arena เชียงราย" />
        <meta name="twitter:image" content="https://www.allstarsarena.com/logo.jpg" />
        <meta name="twitter:url" content="https://www.allstarsarena.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/logo.jpg" />

        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Robots Meta Tags */}
        <meta name="robots" content="index, follow" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
