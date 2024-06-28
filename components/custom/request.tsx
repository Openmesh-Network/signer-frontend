"use client"

import { useEffect, useState } from "react"
import { Address, formatUnits, isAddress } from "viem"

import { ClaimRequest } from "@/lib/requests"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function Request({
  request,
  onApproved,
  onRejected,
}: {
  request: ClaimRequest
  onApproved: () => void
  onRejected: () => void
}) {
  const [parsedRequest, setParsedRequest] = useState<
    { receiver: Address; amount: bigint; claimId: bigint } | undefined
  >(undefined)
  useEffect(() => {
    try {
      if (!isAddress(request.receiver)) {
        throw new Error("Receiver is not a valid address")
      }
      const amount = BigInt(request.amount)
      const claimId = BigInt(request.claimId)

      setParsedRequest({
        receiver: request.receiver,
        amount: amount,
        claimId: claimId,
      })
    } catch (err) {
      console.error(err)
      setParsedRequest(undefined)
    }
  }, [request])

  if (!parsedRequest) {
    return <span>Parsing...</span>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          #{parsedRequest.claimId.toString()}:{" "}
          {formatUnits(parsedRequest.amount, 18)} OPEN to{" "}
          {parsedRequest.receiver}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex gap-x-3">
        {request.type === "pending" && (
          <>
            <Button
              className="bg-green-600 hover:bg-green-800"
              onClick={onApproved}
            >
              Approve
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-800"
              onClick={onRejected}
            >
              Reject
            </Button>
          </>
        )}
        {request.type === "approved" && (
          <span className="bg-green-800">Approved: {request.approvedSig}</span>
        )}
        {request.type === "rejected" && (
          <span className="bg-red-800">Rejected: {request.rejectedReason}</span>
        )}
      </CardFooter>
    </Card>
  )
}
