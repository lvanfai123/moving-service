"use client"
import { SharedQuoteForm } from "@/components/shared-quote-form"

export function HomeQuoteForm() {
  return (
    <SharedQuoteForm
      showTitle={true}
      redirectPath="/quote/submit"
      submitButtonText="提交需求"
      showCard={true}
      title="搬運需求表格"
      description="請填寫您的搬運需求詳情，以獲取最準確的報價"
    />
  )
}
