import Link from 'next/link'

const links = [
  { name: 'Pantheon', href: 'https://blog.pantheon.press' },
  { name: '淡白的记忆', href: 'https://p00q.cn' },
  { name: 'TED.DING', href: 'https://tedding.dev' },
  { name: 'QX 的笔记', href: 'https://lqxhub.github.io' },
  { name: 'h3ee9ine', href: 'https://www.blog.ajie39.top' },
  { name: '4s.sk', href: 'https://4s.sk' },
  { name: '飞刀博客', href: 'https://www.feidaoboke.com' },
  { name: 'mephisto', href: 'https://mephisto.cc' },
]

export default function Links() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="px-4 pt-8 pb-2 text-zinc-500">
        互加友链可以
        <Link
          href="mailto:zhudx6512@gmail.com"
          className="text-sky-500 font-semibold"
        >
          发邮件
        </Link>
        给我
      </div>
      <div className="py-8 px-4 grid sm:grid-cols-2 gap-2">
        {links.map((link) => {
          return (
            <Link
              key={link.href}
              href={link.href}
              className="block bg-white rounded-xl p-2 border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-colors"
              target="_blank"
            >
              <div className="text-zinc-800 font-semibold text-lg mb-1">
                {link.name}
              </div>
              <div className="text-zinc-500 text-sm">{link.href}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
