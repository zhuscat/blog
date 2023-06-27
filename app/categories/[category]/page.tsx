import { PostList } from '@/components/PostList'
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
  return categories.map((category) => {
    return {
      category,
    }
  })
}

export default function CategoryPostList({
  params,
}: {
  params: { category: string }
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
        page={1}
        filter={(post) => post.category === category}
        paginationPrefix={`/categories/${category}/page`}
      />
    </>
  )
}
