import { allAbouts } from 'contentlayer/generated'
import { Article } from '@/components/Article'
import { Tabs } from '@/components/Tab'
import { aboutLangs } from '@/constants'

const About = () => {
  const about = allAbouts.find(
    (about) => about._raw.flattenedPath === 'about/zh-cmn'
  )

  if (!about) throw new Error(`About not found`)

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

export default About
