"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

// 主要菜单项
const MAIN_CATEGORIES = ["Action", "Comedy", "Drama", "Fantasy", "Romance"]

interface LocalVideo {
  id: string
  title: string
  videoPath: string
  thumbnailPath: string | null
}

export default function Home() {
  const [menuActive, setMenuActive] = useState(false)
  const [localVideos, setLocalVideos] = useState<LocalVideo[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    // 加载本地视频
    const loadLocalVideos = async () => {
      try {
        const response = await fetch("/data/local-videos.json")
        if (response.ok) {
          const videos = await response.json()
          if (Array.isArray(videos) && videos.length > 0) {
            setLocalVideos(videos)
            console.log("成功加载本地视频:", videos)
          } else {
            console.log("No local videos found or empty array")
          }
        } else {
          console.error("Failed to load local videos:", response.statusText)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading local videos:", error)
        setLoading(false)
      }
    }

    loadLocalVideos()
  }, [])

  // 视频轮播效果 - 每15秒切换一次视频
  useEffect(() => {
    if (localVideos.length <= 1) return

    const interval = setInterval(() => {
      // 开始淡出
      setIsFading(true)

      // 淡出完成后切换到下一个视频
      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % localVideos.length)
        // 淡入
        setIsFading(false)
      }, 500) // 淡出时间
    }, 15000) // 每15秒切换一次视频

    return () => clearInterval(interval)
  }, [localVideos])

  // 确保视频加载后自动播放
  useEffect(() => {
    const playVideo = async (videoElement: HTMLVideoElement | null) => {
      if (!videoElement) return

      try {
        await videoElement.play()
        console.log("视频开始播放")
      } catch (error) {
        console.error("视频自动播放失败:", error)
      }
    }

    if (videoRef.current) {
      playVideo(videoRef.current)
    }
  }, [currentVideoIndex])

  const handleEnter = () => {
    setMenuActive(true)
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.error("用户交互后播放失败:", err))
    }
  }

  const handleMenuItemClick = (category: string) => {
    setMenuActive(false)
    router.push(`/gallery/${category}`)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <main>
      <div className="hero-container">
        {localVideos.length > 0 ? (
          <video
            ref={videoRef}
            className={`hero-video ${isFading ? 'fade-out' : 'fade-in'}`}
            src={localVideos[currentVideoIndex].videoPath}
            autoPlay
            muted
            loop
            playsInline
            poster={localVideos[currentVideoIndex].thumbnailPath || undefined}
            onError={(e) => console.error("视频加载错误:", e)}
          />
        ) : (
          <div className="hero-static-bg"></div>
        )}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Anime Collection</h1>
          <p className="hero-subtitle">Explore the wonderful world of anime</p>
          <a className="enter-link" onClick={handleEnter}>
            Enter
          </a>
        </div>
      </div>

      <div className={`menu-overlay ${menuActive ? "active" : ""}`} onClick={() => setMenuActive(false)}>
        <div className="menu-container" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-white text-3xl mb-8">Explore Categories</h2>
          <nav className="flex flex-col items-center">
            {MAIN_CATEGORIES.map((category) => (
              <a key={category} className="menu-item" onClick={() => handleMenuItemClick(category)}>
                {category}
              </a>
            ))}
            <a className="menu-item" onClick={() => router.push("/videos")}>
              Videos
            </a>
            <a className="menu-item" onClick={() => router.push("/about")}>
              About
            </a>
          </nav>
        </div>
      </div>
    </main>
  )
}
