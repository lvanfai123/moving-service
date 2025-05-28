"use client"
import { SharedQuoteForm } from "@/components/shared-quote-form"

export default function QuotePage() {
  return (
    <div className="py-12 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">立即獲取報價</h1>
          <p className="text-gray-500 dark:text-gray-400 md:text-xl">
            填寫您的搬運需求，我們將在一小時內為您提供至少三份報價
          </p>
        </div>

        <SharedQuoteForm
          showTitle={true}
          redirectPath="/quote/submit"
          submitButtonText="提交需求"
          showCard={true}
          containerClassName="shadow-lg"
          title="搬運需求表格"
          description="請填寫您的搬運需求詳情，以獲取最準確的報價"
        />
      </div>
    </div>
  )
}
