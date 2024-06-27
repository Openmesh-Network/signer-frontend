"use client"

import React, { createContext, useContext, useState } from "react"
import { VerifiedContributorClaimingContract } from "@/contracts/VerifiedContributorClaiming"
import { Address } from "viem"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Service {
  name: string
  downloadUri: string
  uploadUri: string
  account: Address
  claimingContract: Address
  reviewSecret?: string
}
const services: Service[] = [
  {
    name: "OVC",
    downloadUri: "/ovc/claimRequests",
    uploadUri: "/ovc/reviewClaimRequests",
    account: "0xf2Bb57E104Bc9A8B398A6b47E3579389798b273a",
    claimingContract: VerifiedContributorClaimingContract.address,
    reviewSecret: process.env.NEXT_PUBLIC_OVC_CLAIM_REVIEW_SECRET,
  },
]

const ServiceSelectContext = createContext<Service>(services[0])
const SetServiceSelectContext = createContext<(service: Service) => void>(
  () => {}
)

export function ServiceSelectProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedService, setSelectedService] = useState<Service>(services[0])

  return (
    <ServiceSelectContext.Provider value={selectedService}>
      <SetServiceSelectContext.Provider value={setSelectedService}>
        {children}
      </SetServiceSelectContext.Provider>
    </ServiceSelectContext.Provider>
  )
}

export function useServiceSelect() {
  return useContext(ServiceSelectContext)
}

function useSetServiceSelect() {
  return useContext(SetServiceSelectContext)
}

export function ServiceSelect() {
  const serviceSelect = useServiceSelect()
  const setServiceSelect = useSetServiceSelect()

  return (
    <div className="flex items-center gap-x-4">
      <span>Service:</span>
      <Select
        value={serviceSelect.name}
        onValueChange={(e) => {
          const service = services.find((s) => s.name === e)
          if (!service) {
            throw new Error(`Could not find service with id ${e}`)
          }

          setServiceSelect(service)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a service" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Services</SelectLabel>
            {services.map((service, i) => (
              <SelectItem value={service.name}>{service.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
