import { allAbouts } from 'contentlayer/generated'
import { Article } from '@/components/Article'
import { Tabs } from '@/components/Tab'
import { aboutLangs } from '@/constants'

export const generateStaticParams = async () =>
  allAbouts.map((about) => ({ slug: about._raw.flattenedPath }))

const AboutLayout = ({ params }: { params: { lang: string } }) => {
  const about = allAbouts.find(
    (about) =>
      about._raw.flattenedPath === 'about/' + decodeURIComponent(params.lang)
  )

  if (!about) throw new Error(`About not found for lang: ${params.lang}`)

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <div className="pt-8 px-4">
          <Tabs items={aboutLangs} />
        </div>
      </div>
      <Article article={about} />
    </>
  )
}

export default AboutLayout
