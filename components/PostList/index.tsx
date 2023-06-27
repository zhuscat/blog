import { Post, allPosts } from 'contentlayer/generated'
import dayjs from 'dayjs'
import { PostCard } from '../PostCard'
import { POST_PAGE_SIZE } from '@/constants'
import Link from 'next/link'

export function PostList({
  page,
  filter,
  paginationPrefix = '/posts/page',
}: {
  page: number
  filter?: (post: Post) => boolean
  paginationPrefix?: string
}) {
  const filteredPosts = allPosts.filter((post) => {
    if (filter) {
      return filter(post)
    }
    return true
  })
  const posts = filteredPosts
    .sort((a, b) => {
      if (dayjs(a.date).isAfter(b.date)) {
        return -1
      }
      return 1
    })
    .slice(POST_PAGE_SIZE * (page - 1), POST_PAGE_SIZE * page)
  const pageCount = Math.ceil(filteredPosts.length / POST_PAGE_SIZE)
  const tagMap = new Map<string, number>()
  allPosts.forEach((post) => {
    if (post.tags?.length) {
      post.tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, 0)
        }
        tagMap.set(tag, tagMap.get(tag)! + 1)
      })
    }
  })
  const tags = [...tagMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map((item) => item[0])
    .slice(0, 20)

  const categoryMap = new Map<string, number>()

  allPosts.forEach((post) => {
    if (post.category) {
      if (!categoryMap.has(post.category)) {
        categoryMap.set(post.category, 0)
      }
      categoryMap.set(post.category, categoryMap.get(post.category)! + 1)
    }
  })
  const categories = [...categoryMap.entries()].map((item) => {
    return {
      name: item[0],
      count: item[1],
      displayName: `${item[0]}(${item[1]})`,
    }
  })

  return (
    <div className="mx-auto max-w-3xl py-8 flex">
      <div className="flex-auto mr-6">
        <div className="mb-2">
          {posts.map((post, idx) => (
            <PostCard key={idx} {...post} />
          ))}
        </div>
        {pageCount !== 1 && (
          <div className="flex items-center text-sm">
            {page > 1 && (
              <Link
                href={`${paginationPrefix}/${page - 1}`}
                className="hover:text-sky-500 hover:font-semibold ml-4"
              >
                上一页
              </Link>
            )}
            <div className="mx-4 text-slate-500">
              第 {page} 页 / 共 {pageCount} 页
            </div>
            {page < pageCount && (
              <Link
                href={`${paginationPrefix}/${page + 1}`}
                className="hover:text-sky-500 hover:font-semibold"
              >
                下一页
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="hidden md:block flex-none w-40">
        <div className="mb-4">
          <div className="font-semibold font-base mb-1">分类</div>
          <div className="text-slate-600 text-sm">
            {categories.map((category) => {
              return (
                <Link
                  key={category.name}
                  className="block whitespace-nowrap hover:text-sky-400 hover:font-semibold"
                  href={`/categories/${category.name}`}
                >
                  {category.displayName}
                </Link>
              )
            })}
          </div>
        </div>
        <div>
          <div className="font-semibold font-base mb-1">标签</div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-600">
            {tags.map((tag) => {
              return (
                <Link
                  key={tag}
                  className="group whitespace-nowrap"
                  href={`/tags/${tag}`}
                >
                  <span className="group-hover:text-sky-400">#</span>
                  <span className="group-hover:text-slate-800">{tag}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
