"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { cookieStorage, createStorage, http, WagmiProvider } from "wagmi"
import { sepolia } from "wagmi/chains"

import { siteConfig } from "@/config/site"

export const chains = [sepolia] as const
export const defaultChain = sepolia

const appName = siteConfig.name
const appDescription = siteConfig.description
const appIcon = "http://localhost:3000/icon.png" as const
const appUrl = "http://localhost:3000" as const
const metadata = {
  name: appName,
  description: appDescription,
  url: appUrl,
  icons: [appIcon],
}

const projectId = "010a2c01a8ee011879a49d148d958314" as const // WalletConnect
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [sepolia.id]: http("https://rpc2.sepolia.org"),
  },
  auth: {
    email: false,
  },
})

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
