"use client"

import { useState } from "react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface OrderAlertDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function OrderAlertDialog({ isOpen, onClose }: OrderAlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="overflow-hidden p-0">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-1">
          {/* Header accent line */}
        </div>
        <div className="p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>
              localhost:3001 indique
            </AlertDialogTitle>
            <AlertDialogDescription>
              Fonction de commande à implémenter
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction onClick={onClose}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OrderAlertDialog 