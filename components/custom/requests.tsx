"use client"

import { useState } from "react"
import axios from "axios"
import { Address } from "viem"
import { sepolia } from "viem/chains"
import { useWalletClient } from "wagmi"

import { ClaimRequest, PendingClaimRequest } from "@/lib/requests"
import { Button } from "@/components/ui/button"

import { Request } from "./request"
import { useServiceSelect } from "./service-select"

export function Requests() {
  const [requests, setRequests] = useState<ClaimRequest[]>([])
  const service = useServiceSelect()
  const { data: walletClient } = useWalletClient()

  return (
    <div>
      <div className="flex gap-3">
        <Button
          onClick={() => {
            const getRequests = async () => {
              const response = await axios
                .get(service.downloadUri)
                .then((res) => res.data as PendingClaimRequest[])
              setRequests(response)
            }

            getRequests().catch(console.error)
          }}
        >
          Get requests
        </Button>
        <Button
          onClick={() => {
            const uploadRequests = async () => {
              console.log(service.reviewSecret)
              await axios.post(
                service.uploadUri,
                requests.filter((req) => req.type !== "pending"),
                { headers: { Authorization: service.reviewSecret } }
              )
            }

            uploadRequests().catch(console.error)
          }}
        >
          Upload requests
        </Button>
      </div>
      <div>
        {requests.map((request, i) => (
          <Request
            key={i}
            request={request}
            onApproved={() => {
              const getSig = async () => {
                if (!walletClient) {
                  throw new Error("WalletClient undefined")
                }

                const domain = {
                  name: "OpenClaiming",
                  version: "1",
                  chainId: sepolia.id,
                  verifyingContract: service.claimingContract,
                } as const
                const types = {
                  Claim: [
                    { name: "proofId", type: "uint256" },
                    { name: "claimer", type: "address" },
                    { name: "amount", type: "uint256" },
                  ],
                } as const
                return await walletClient.signTypedData({
                  domain: domain,
                  types: types,
                  primaryType: "Claim",
                  message: {
                    proofId: BigInt(request.claimId),
                    claimer: request.receiver as Address,
                    amount: BigInt(request.amount),
                  },
                })
              }

              getSig()
                .then((sig) => {
                  const newRequests = [...requests]
                  newRequests[i] = {
                    ...request,
                    type: "approved",
                    approvedSig: sig,
                  }
                  setRequests(newRequests)
                })
                .catch(console.error)
            }}
            onRejected={() => {
              const reason = prompt("")
              if (!reason) {
                console.error("No reason was provided")
                return
              }
              const newRequests = [...requests]
              newRequests[i] = {
                ...request,
                type: "rejected",
                rejectedReason: reason,
              }
              setRequests(newRequests)
            }}
          />
        ))}
      </div>
    </div>
  )
}
