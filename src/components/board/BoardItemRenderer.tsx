import { ImageBoardItem } from './ImageBoardItem'
import { TextBoardItem } from './TextBoardItem'
import type { Asset } from '../../types/asset'
import type { BoardItem } from '../../types/board'

type AssetEntry = Asset & {
  url: string
}

type BoardItemRendererProps = {
  item: BoardItem
  asset?: AssetEntry
}

export function BoardItemRenderer({ item, asset }: BoardItemRendererProps) {
  if (item.type === 'image') {
    return <ImageBoardItem item={item} asset={asset} />
  }

  return <TextBoardItem item={item} />
}
