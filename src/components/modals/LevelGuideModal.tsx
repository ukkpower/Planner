import { X } from 'lucide-react'

type LevelGuideModalProps = {
  onClose: () => void
}

const levelGuideTiers = [
  {
    tier: 'Tier 1: Obvious',
    levels: '1-5',
    differences: '8-9',
    sceneComplexity:
      'Smallest room sizes, fewest objects, clean layouts, clear sight lines. The player should immediately understand how the game works and feel rewarded quickly.',
    differenceStyle: (
      <>
        Clear visual changes such as <strong>colour changes, size changes, object rotation, object moved slightly, object swapped</strong>, and easy missing items.
      </>
    ),
  },
  {
    tier: 'Tier 2: Subtle / Missing',
    levels: '6-10',
    differences: '9-10',
    sceneComplexity:
      'Same cosy readability as Tier 1, but with more decorative objects such as wall art, cushions, books, small plants, table items, and shelf details.',
    differenceStyle: (
      <>
        Includes all Tier 1 changes, plus more subtle changes like <strong>missing small objects, changed pictures on walls, cushion pattern changes, blanket details, book spine changes, small decor swaps</strong>.
      </>
    ),
  },
  {
    tier: 'Tier 3: Patterns & Counts',
    levels: '11-15',
    differences: '10-12',
    sceneComplexity:
      'Larger rooms or more visually rich rooms. More shelves, plants, fabrics, repeated objects, wall details, and layered cosy clutter.',
    differenceStyle: (
      <>
        Includes all previous tiers, plus <strong>pattern differences, object count changes, leaf counts on plants, number of candles, books, flowers, tiles, stars, dots, stripes, handles, jars, ornaments</strong>, etc.
      </>
    ),
  },
  {
    tier: 'Tier 4: Hidden / Interactive',
    levels: '16-20',
    differences: '12-14',
    sceneComplexity:
      'Most detailed rooms, with interactive objects and layered areas. The room should still feel cosy and readable, but players now need to investigate the space more actively.',
    differenceStyle: (
      <>
        Includes all previous tiers, plus <strong>differences hidden inside interactable objects</strong> such as fridge doors, cupboards, drawers, toy boxes, wardrobes, ovens, treasure chests, baskets, curtains, or window shutters.
      </>
    ),
  },
]

export function LevelGuideModal({ onClose }: LevelGuideModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 px-5 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-guide-title"
        className="flex max-h-[calc(100vh-48px)] w-full max-w-6xl flex-col overflow-hidden rounded-[8px] border border-white/12 bg-[#1d2028] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#88c39d]">
              Level design
            </p>
            <h2 id="level-guide-title" className="mt-1 text-xl font-semibold text-white">
              Level Guide
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
          <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                <th className="rounded-tl-[8px] border border-r-0 border-white/10 bg-[#12151b] px-4 py-3">
                  Tier
                </th>
                <th className="border border-r-0 border-white/10 bg-[#12151b] px-4 py-3 text-right">
                  Levels
                </th>
                <th className="border border-r-0 border-white/10 bg-[#12151b] px-4 py-3 text-right">
                  Number of Differences
                </th>
                <th className="border border-r-0 border-white/10 bg-[#12151b] px-4 py-3">
                  Scene Complexity
                </th>
                <th className="rounded-tr-[8px] border border-white/10 bg-[#12151b] px-4 py-3">
                  Difference Style
                </th>
              </tr>
            </thead>
            <tbody className="text-stone-300">
              {levelGuideTiers.map((tier, index) => {
                const isLast = index === levelGuideTiers.length - 1

                return (
                  <tr key={tier.tier}>
                    <td
                      className={`border border-r-0 border-t-0 border-white/10 px-4 py-4 align-top font-semibold text-white ${
                        isLast ? 'rounded-bl-[8px]' : ''
                      }`}
                    >
                      {tier.tier}
                    </td>
                    <td className="border border-r-0 border-t-0 border-white/10 px-4 py-4 text-right align-top font-semibold text-[#88c39d]">
                      {tier.levels}
                    </td>
                    <td className="border border-r-0 border-t-0 border-white/10 px-4 py-4 text-right align-top font-semibold text-[#88c39d]">
                      {tier.differences}
                    </td>
                    <td className="border border-r-0 border-t-0 border-white/10 px-4 py-4 align-top leading-6 text-stone-300">
                      {tier.sceneComplexity}
                    </td>
                    <td
                      className={`border border-t-0 border-white/10 px-4 py-4 align-top leading-6 text-stone-300 [&_strong]:font-semibold [&_strong]:text-white ${
                        isLast ? 'rounded-br-[8px]' : ''
                      }`}
                    >
                      {tier.differenceStyle}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
