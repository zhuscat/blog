import { AnniversaryCountdowwn } from '@/components/AnniversaryCountdown'
import TablerHeartFilled from '@/components/Icon/TablerHeartFilled'
import Image from 'next/image'

export default function Anniversary() {
  return (
    <div className="mx-auto max-w-3xl flex flex-col items-center py-8">
      <div className="w-[200px] rounded-xl overflow-hidden object-cover mb-4">
        <Image
          src="https://s2.loli.net/2022/01/07/skOiQIfT7xdXPFR.jpg"
          width={200}
          height={200}
          alt=""
        />
      </div>
      <div className="flex items-center text-3xl mb-4 font-semibold">
        <div>Z</div>
        <TablerHeartFilled className="mx-2 text-red-600" />
        <div>C</div>
      </div>
      <div className="text-lg mb-4 text-stone-700">已经过了</div>
      <AnniversaryCountdowwn />
    </div>
  )
}
