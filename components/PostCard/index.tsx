import { Post } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'
import dayjs from 'dayjs'
import Link from 'next/link'
import TablerArrowNarrowRight from '../Icon/TablerArrowNarrowRight'
import { TablerBook } from '../Icon/TablerBook'

export function PostCard(post: Post) {
  return (
    <Link
      href={post.url}
      className="group block bg-white hover:bg-gray-50 p-4 rounded-xl text-ellipsis mb-1 transition-colors duration-200"
    >
      <div className="flex text-sm text-gray-500 mb-1">
        <time dateTime={post.date} className="block mr-2">
          {dayjs(post.date).format('YYYY-MM-DD')}
        </time>
        <div className="flex items-center">
          <TablerBook className="text-base mr-1" />
          预计 {post.estimateReadingTime} 分钟
        </div>
      </div>
      <h2 className="text-base font-semibold mb-1">{post.title}</h2>
      <div
        className="text-sm text-gray-600 mb-2"
        dangerouslySetInnerHTML={{ __html: post.excerpt }}
      />
      <div className="text-sm text-gray-500 flex items-center group-hover:text-sky-500 group-hover:font-semibold transition-colors duration-200">
        <span className="mr-1">阅读全部</span>
        <TablerArrowNarrowRight />
      </div>
    </Link>
  )
}
