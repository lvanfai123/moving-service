"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface RecaptchaProps {
  onVerify: (token: string) => void
}

export function Recaptcha({ onVerify }: RecaptchaProps) {
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  // reCAPTCHA 網站金鑰
  const siteKey = "6LeX6UQrAAAAAPdXuVYaEaQAOKgkuEcHTksgZQt6"

  useEffect(() => {
    if (loaded && containerRef.current && !widgetIdRef.current) {
      // 確保 window.grecaptcha 已定義
      if (window.grecaptcha && window.grecaptcha.render) {
        try {
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            "expired-callback": () => onVerify(""),
          })
        } catch (error) {
          console.error("reCAPTCHA 渲染錯誤:", error)
        }
      }
    }
  }, [loaded, onVerify])

  // 重置 reCAPTCHA
  const reset = () => {
    if (window.grecaptcha && widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current)
    }
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=explicit`}
        onLoad={() => setLoaded(true)}
        strategy="lazyOnload"
      />
      <div className="flex justify-center my-4">
        <div ref={containerRef} />
      </div>
    </>
  )
}

// 為 window 對象添加 grecaptcha 類型
declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback": () => void
        },
      ) => number
      reset: (widgetId: number) => void
    }
  }
}
