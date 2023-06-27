import { PostList } from '@/components/PostList'
import { POST_PAGE_SIZE } from '@/constants'
import { allPosts } from 'contentlayer/generated'

export async function generateStaticParams() {
  const params = [
    ...new Array(Math.ceil(allPosts.length / POST_PAGE_SIZE)),
  ].map((_, idx) => ({
    page: '' + (idx + 1),
  }))

  return params
}

export default function Home({ params }: { params: { page: string } }) {
  return <PostList page={+params.page} />
}
