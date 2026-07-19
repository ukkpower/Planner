import type { PropsWithChildren } from 'react'
import { ConvexProvider } from 'convex/react'
import { convex } from '../lib/convex'

export function AppProviders({ children }: PropsWithChildren) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
