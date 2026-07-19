import { Check, Palette, Sparkles, X, XIcon } from 'lucide-react'

type DesignGuideModalProps = {
  onClose: () => void
}

const colours = [
  { name: 'Cream', value: '#f3e7c9' },
  { name: 'Warm white', value: '#f7f1e5' },
  { name: 'Beige', value: '#d5c3a5' },
  { name: 'Honey wood', value: '#bf884f' },
  { name: 'Sage green', value: '#9caf88' },
  { name: 'Olive green', value: '#7d8250' },
  { name: 'Dusty blue', value: '#829aab' },
  { name: 'Soft yellow', value: '#e3c875' },
  { name: 'Terracotta', value: '#b9674f' },
  { name: 'Clay red', value: '#9e5548' },
  { name: 'Muted pink', value: '#c99494' },
  { name: 'Peach', value: '#dfa683' },
  { name: 'Warm brown', value: '#795b48' },
]

const textureUse = [
  'Soft wood',
  'Matte painted surfaces',
  'Gentle fabric textures',
  'Simple wallpaper patterns',
  'Soft rugs',
  'Lightly stylised stone or brick',
  'Matte ceramics',
  'Subtle tile patterns',
  'Painted or handcrafted-looking props',
]

const textureAvoid = [
  'Photorealistic texture scans',
  'Heavy wood grain',
  'Dirty or gritty materials',
  'Sharp realistic fabric detail',
  'Very shiny metals',
  'Noisy wallpaper',
  'Complex patterns across large areas',
]

const patternPlaces = [
  'Cushions',
  'Rugs',
  'Blankets',
  'Curtains',
  'Wallpaper',
  'Tiles',
  'Book spines',
  'Plant leaves',
  'Small decor items',
]

const patternDifferences = [
  'Cushion pattern changes',
  'Rug border changes',
  'Missing stripe or dot',
  'Leaf count changes',
  'Tile pattern changes',
  'Wallpaper detail changes',
]

function ListCard({
  title,
  items,
  variant = 'use',
}: {
  title: string
  items: string[]
  variant?: 'use' | 'avoid'
}) {
  const isUse = variant === 'use'
  const Icon = isUse ? Check : XIcon

  return (
    <div className="rounded-[8px] border border-white/10 bg-[#15181f] p-5">
      <h4 className={`text-sm font-semibold ${isUse ? 'text-[#a8d8b8]' : 'text-[#e3a59a]'}`}>
        {title}
      </h4>
      <ul className="mt-4 grid gap-2.5 text-sm text-stone-300 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 leading-5">
            <Icon
              size={15}
              className={`mt-0.5 shrink-0 ${isUse ? 'text-[#88c39d]' : 'text-[#c8786a]'}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DesignGuideModal({ onClose }: DesignGuideModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 px-5 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="design-guide-title"
        className="flex max-h-[calc(100vh-48px)] w-full max-w-6xl flex-col overflow-hidden rounded-[8px] border border-white/12 bg-[#1d2028] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88c39d]">
              Colour &amp; texture
            </p>
            <h2 id="design-guide-title" className="mt-1 text-xl font-semibold text-white">
              Level Design Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-[8px] text-stone-400 transition hover:bg-white/10 hover:text-white"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-auto p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            <section className="rounded-[8px] border border-[#88c39d]/20 bg-[linear-gradient(135deg,rgba(136,195,157,0.12),rgba(136,195,157,0.025))] p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#88c39d]/15 text-[#a8d8b8]">
                  <Sparkles size={19} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Core Visual Goal</h3>
                  <p className="mt-2 leading-7 text-stone-300">
                    Each level should feel like a soft, cosy miniature room rather than a realistic interior.
                  </p>
                  <p className="mt-2 leading-7 text-stone-300">
                    The rooms should look handcrafted, warm, charming, and easy to read. The style should feel closer to a cosy 3D illustration or toy-like diorama than a photorealistic room.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <Palette size={18} className="text-[#88c39d]" />
                <h3 className="text-lg font-semibold text-white">Colour Direction</h3>
              </div>
              <p className="mb-4 text-sm leading-6 text-stone-300">Use soft, warm, muted colours.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                {colours.map((colour) => (
                  <div key={colour.name} className="flex items-center gap-2.5 rounded-[8px] border border-white/10 bg-[#15181f] p-2.5">
                    <span className="h-7 w-7 shrink-0 rounded-full border border-white/15" style={{ backgroundColor: colour.value }} />
                    <span className="text-xs font-medium text-stone-300">{colour.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ListCard
                  title="Avoid"
                  variant="avoid"
                  items={[
                    'Neon colours', 'Harsh primary colours', 'Cold grey interiors',
                    'Very dark colour palettes', 'Strong black and white contrast',
                    'Too many bright colours in one room',
                  ]}
                />
                <div className="rounded-[8px] border border-white/10 bg-[#15181f] p-5">
                  <h4 className="text-sm font-semibold text-white">Keep each palette simple</h4>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-stone-300">
                    <span>1 main colour</span><span>1 secondary colour</span>
                    <span>1 accent colour</span><span>2–3 neutral support colours</span>
                  </div>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#88c39d]">Irish Cottage Kitchen</p>
                    <p className="mt-2 text-sm leading-6 text-stone-400">
                      <strong className="text-stone-200">Main:</strong> warm cream · <strong className="text-stone-200">Secondary:</strong> sage green · <strong className="text-stone-200">Accent:</strong> copper / terracotta · <strong className="text-stone-200">Support:</strong> honey wood, soft white, muted brown
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white">Texture Direction</h3>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                Textures should be simple, soft, and slightly stylised. They should add warmth and charm without making the scene visually noisy.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ListCard title="Use" items={textureUse} />
                <ListCard title="Avoid" variant="avoid" items={textureAvoid} />
              </div>
              <blockquote className="mt-4 rounded-[8px] border-l-4 border-[#88c39d] bg-[#88c39d]/[0.07] px-5 py-4 font-medium text-white">
                If a texture makes it harder to spot differences, simplify it.
              </blockquote>
            </section>

            <section className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white">Materials</h3>
              <p className="mt-2 text-sm leading-6 text-stone-300">Most materials should feel soft, matte, and cosy.</p>
              <ul className="mt-4 grid gap-3 rounded-[8px] border border-white/10 bg-[#15181f] p-5 text-sm text-stone-300 md:grid-cols-2">
                {[
                  'Wood should feel warm and soft, not overly detailed.',
                  'Fabric should look comfortable and simple.',
                  'Metal should be muted, not highly reflective.',
                  'Stone and brick should be softened and stylised.',
                  'Ceramics should be matte or lightly glazed.',
                  'Glass should be used carefully so reflections do not confuse the player.',
                ].map((item) => <li key={item} className="flex gap-2.5 leading-6"><Check size={15} className="mt-1 shrink-0 text-[#88c39d]" />{item}</li>)}
              </ul>
              <p className="mt-3 text-sm font-medium text-[#e3a59a]">Avoid making anything look too sharp, glossy, cold, or realistic.</p>
            </section>

            <section className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white">Pattern Use</h3>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                Patterns are useful, but they should be controlled. Use them in focused areas so they can create differences without overwhelming the player.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ListCard title="Good places for patterns" items={patternPlaces} />
                <ListCard title="Good pattern differences" items={patternDifferences} />
              </div>
              <p className="mt-3 text-sm font-medium text-[#e3a59a]">Avoid using busy patterns everywhere.</p>
            </section>

            <section className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white">Lighting</h3>
              <p className="mt-2 text-sm leading-6 text-stone-300">Lighting should be warm, soft, and readable. The room should always feel calm, safe, and easy to inspect.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ListCard title="Use" items={['Window light', 'Lamps', 'Candles', 'Fairy lights', 'Fireplaces', 'Warm ceiling lights']} />
                <ListCard title="Avoid" variant="avoid" items={['Harsh shadows', 'Very dark corners', 'Cold blue lighting', 'Strong dramatic lighting', 'Lighting that hides differences']} />
              </div>
            </section>

            <section className="rounded-[8px] border border-[#88c39d]/25 bg-[#15181f] p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88c39d]">Final Style Rule</p>
              <p className="mt-4 text-lg font-semibold text-white">Warm, soft, cosy, stylised, and easy to compare.</p>
              <p className="mt-2 text-sm text-stone-400">Never realistic, gritty, glossy, dark, or visually noisy.</p>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-stone-300">
                The art style should always support the gameplay. The rooms can be detailed and beautiful, but the player must still be able to clearly spot the differences.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
