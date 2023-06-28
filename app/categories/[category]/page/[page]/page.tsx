import { PostList } from '@/components/PostList'
import { POST_PAGE_SIZE } from '@/constants'
import { allPosts } from 'contentlayer/generated'

export async function generateStaticParams() {
  const set = new Set<string>()
  allPosts.forEach((post) => {
    if (post.category) {
      set.add(post.category)
    }
  })
  const categories: string[] = []
  set.forEach((category) => {
    categories.push(category)
  })
  return categories.flatMap((category) => {
    const filteredPosts = allPosts.filter((post) => post.category === category)
    return [...new Array(Math.ceil(filteredPosts.length / POST_PAGE_SIZE))].map(
      (_, idx) => {
        return {
          page: '' + (idx + 1),
          category,
        }
      }
    )
  })
}

export default function CategoryPostList({
  params,
}: {
  params: { category: string; page: string }
}) {
  const category = decodeURIComponent(params.category)

  return (
    <>
      <div className="mx-auto max-w-3xl px-2 pt-6">
        <div className="text-base text-gray-600 bg-sky-50 border border-solid border-sky-100 rounded-lg p-2 shadow-sm">
          以下是分类为
          <span className="text-sky-500 font-semibold px-1">{category}</span>
          的文章
        </div>
      </div>
      <PostList
        page={+params.page}
        filter={(post) => post.category === category}
        paginationPrefix={`/categories/${category}/page`}
      />
    </>
  )
}
