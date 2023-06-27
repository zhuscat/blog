import { PostList } from '@/components/PostList'
import { POST_PAGE_SIZE } from '@/constants'
import { allPosts } from 'contentlayer/generated'

export async function generateStaticParams() {
  const set = new Set<string>()
  allPosts.forEach((post) => {
    ;(post.tags ?? []).forEach((tag) => {
      set.add(tag)
    })
  })
  const tags: string[] = []
  set.forEach((tag) => {
    tags.push(tag)
  })
  return tags.flatMap((tag) => {
    const filteredPosts = allPosts.filter(
      (post) => post.tags?.includes(tag) ?? false
    )
    return [...new Array(Math.ceil(filteredPosts.length / POST_PAGE_SIZE))].map(
      (_, idx) => {
        return {
          page: '' + (idx + 1),
          tag,
        }
      }
    )
  })
}

export default function TagPostList({
  params,
}: {
  params: { tag: string; page: string }
}) {
  const tag = decodeURIComponent(params.tag)

  return (
    <>
      <div className="mx-auto max-w-3xl px-2 pt-6">
        <div className="text-base text-gray-600 bg-sky-50 border border-solid border-sky-100 rounded-lg p-2 shadow-sm">
          以下是带有
          <span className="text-sky-500 font-semibold px-1">#{tag}</span>
          的文章
        </div>
      </div>
      <PostList
        page={+params.page}
        filter={(post) => post.tags?.includes(decodeURIComponent(tag)) ?? false}
        paginationPrefix={`/tags/${tag}/page`}
      />
    </>
  )
}
