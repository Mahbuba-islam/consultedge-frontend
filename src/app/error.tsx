"use client"

import { AlertTriangle } from "lucide-react"

export default function Error() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center px-4">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />

      <h2 className="text-xl font-semibold text-[#1C1D1F]">
        Something went wrong
      </h2>

      <p className="mt-2 text-sm text-[#6A6F73] max-w-sm">
        We couldn’t load this page right now. Please try again or refresh.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-md bg-[#5624D0] px-5 py-2 text-white text-sm font-medium hover:bg-[#4a1fb8] transition"
      >
        Refresh Page
      </button>
    </div>
  )
}