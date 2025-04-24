"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

export default function Live2dWrapper() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) return

    // 初始化Live2D
    if (typeof window !== "undefined" && window.L2Dwidget) {
      window.L2Dwidget.init({
        model: {
          jsonPath: "https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json",
          scale: 1,
        },
        display: {
          position: "left",
          width: 200,
          height: 300,
          hOffset: 0,
          vOffset: 0,
        },
        mobile: {
          show: true,
          scale: 0.8,
        },
        react: {
          opacityDefault: 0.8,
          opacityOnHover: 1,
        },
      })
    }
  }, [loaded])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js"
        onLoad={() => setLoaded(true)}
      />
      <div ref={containerRef} className="live2d-container" />
    </>
  )
}

// 为TypeScript添加全局类型定义
declare global {
  interface Window {
    L2Dwidget: {
      init: (config: any) => void
    }
  }
}
