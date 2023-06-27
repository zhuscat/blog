import TablerHeartFilled from '@/components/Icon/TablerHeartFilled'
import './globals.scss'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ZhusCafe',
  description: 'Generated by create next app',
}

function Header() {
  return (
    <header className="h-16 mx-auto max-w-3xl flex items-center justify-between p-4">
      <Link href="/">
        <h1 className="font-semibold text-slate-700 text-xl hover:text-slate-900">
          {metadata.title.toUpperCase()}
        </h1>
      </Link>
      <div className="flex items-center">
        <Link href="/anniversary" className="text-red-500 mr-4">
          <TablerHeartFilled />
        </Link>
        <Link
          href="/about"
          className="hover:text-blue-500 hover:font-semibold text-base"
        >
          关于
        </Link>
      </div>
    </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Header></Header>
        <main>{children}</main>
        <footer className="mx-auto max-w-3xl text-sm px-4 text-gray-400 pt-2 pb-4">
          <div className="mb-1">©️ 2015 - 2023 zhuscat</div>
          <div>Hosted on Vercel</div>
        </footer>
      </body>
    </html>
  )
}
