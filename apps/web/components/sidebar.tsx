import { CheckCircleSolidIcon } from './icons/check-circle-solid'

export const Sidebar = () => {
  return (
    <div className="w-[300px]">
      <div className="text-lg font-semibold">Most Helpful</div>

      <div className="mt-2 grid grid-cols-1 divide-y divide-neutral-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between py-2">
            <div className="flex space-x-2 items-center">
              <img
                src="http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Favatars%2F258390283127881728%2Fa_1f3f829c00186303e146b8aee9a20608.gif%3Fsize%3D256&w=48&q=75"
                alt="Avatar"
                className="w-4 h-4 rounded-full"
              />
              <div className="opacity-90">rafaelalmeidatk</div>
            </div>
            <div className="flex items-center space-x-1 opacity-90">
              <CheckCircleSolidIcon size={5} />
              <span className="text-sm ">2</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
