import { Waline } from '@/components/Waline'
import dayjs from 'dayjs'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { TablerBook } from '../Icon/TablerBook'
import { Code } from 'bright'
import { About, Post, isType } from 'contentlayer/generated'

function CodeBlock(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  >
) {
  return (
    // @ts-ignore
    <Code
      {...props}
      theme="min-light"
      style={{
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        whiteSpace: 'nowrap',
      }}
    />
  )
}

export const Article = ({ article }: { article: Post | About }) => {
  const MDXContent = useMDXComponent(article.body.code)

  return (
    <article className="mx-auto max-w-3xl">
      <div className="py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
          <div className="text-sm text-gray-600 flex items-center">
            <time dateTime={article.date} className="mr-2">
              {dayjs(article.date).format('YYYY-MM-DD')}
            </time>
            {isType('Post', article) && (
              <div className="flex items-center">
                <TablerBook className="text-base mr-1" />
                预计 {article.estimateReadingTime} 分钟
              </div>
            )}
          </div>
        </div>
        <div className="prose">
          <MDXContent
            components={{
              pre: CodeBlock,
            }}
          />
        </div>
        {isType('Post', article) && (
          <div>
            {article.tags?.length && (
              <div className="text-gray-500 text-sm flex flex-wrap gap-2">
                {article.tags.map((tag) => {
                  return (
                    <div key={tag}>
                      <span className="mr-0.5">#</span>
                      <span>{tag}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <Waline />
    </article>
  )
}
