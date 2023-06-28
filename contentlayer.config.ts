import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  contentType: 'mdx',
  filePathPattern: `posts/**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    category: { type: 'string', required: false },
    lang: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/${post._raw.flattenedPath}`,
    },
    excerpt: {
      type: 'string',
      resolve: (post) => {
        return post.body.raw
          .split('\n')
          .find(
            (line) => !!line && !line.startsWith('#') && !line.startsWith('```')
          )
      },
    },
    estimateReadingTime: {
      type: 'number',
      resolve: (post) => {
        const wordCount = post.body.raw.length
        const wordsPerMinute = 300
        return Math.ceil(wordCount / wordsPerMinute)
      },
    },
  },
}))

export const About = defineDocumentType(() => ({
  name: 'About',
  contentType: 'mdx',
  filePathPattern: `about/**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    lang: { type: 'string', required: false },
  },
}))

export default makeSource({
  contentDirPath: './',
  documentTypes: [Post, About],
  mdx: {
    remarkPlugins: [remarkGfm],
  },
})
