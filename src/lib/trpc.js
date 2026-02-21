import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

const API_URL = import.meta.env.VITE_API_URL || 'https://3000-iofk42tnf1qwkk8m5zhyy-de4313a9.us2.manus.computer'

export const trpc = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: `${API_URL}/api/trpc`,
      credentials: 'include',
    }),
  ],
})