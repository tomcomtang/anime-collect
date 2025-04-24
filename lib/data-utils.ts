// 直接导入JSON数据
import genresData from "../public/data/genres.json"
import formatsData from "../public/data/formats.json"
import yearsData from "../public/data/years.json"
import statusData from "../public/data/status.json"
import trailersData from "../public/data/trailers.json"

interface AnimeItem {
  id: number
  title: {
    romaji: string
    english: string
    native: string
  }
  coverImage: {
    extraLarge: string
    large: string
    medium: string
    color: string
  }
  bannerImage: string
  trailer?: {
    id: string
    site: string
    thumbnail: string
  }
}

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  url: string
  animeTitle: string
}

// 获取特定类别的数据
export async function getCategoryData(dataType: string, category: string): Promise<AnimeItem[]> {
  try {
    // 根据数据类型选择对应的导入数据
    let data
    switch (dataType) {
      case "genres":
        data = genresData
        break
      case "formats":
        data = formatsData
        break
      case "years":
        data = yearsData
        break
      case "status":
        data = statusData
        break
      default:
        data = {}
    }

    return data[category] || []
  } catch (error) {
    console.error(`Error getting ${category} data:`, error)
    return []
  }
}

// 获取所有类别
export async function getAllCategories(): Promise<string[]> {
  try {
    return Object.keys(genresData)
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

// 获取随机预告片
export async function getRandomTrailer(): Promise<VideoItem | null> {
  try {
    // 首先尝试从专门的预告片集合中获取
    if (trailersData && trailersData.length > 0) {
      const randomIndex = Math.floor(Math.random() * trailersData.length)
      const trailer = trailersData[randomIndex]

      if (trailer.trailer && trailer.trailer.id && trailer.trailer.site === "youtube") {
        return {
          id: trailer.trailer.id,
          title: "预告片",
          thumbnail: trailer.trailer.thumbnail || trailer.coverImage.extraLarge,
          url: `https://www.youtube.com/embed/${trailer.trailer.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.trailer.id}`,
          animeTitle: trailer.title.romaji || trailer.title.english,
        }
      }
    }

    // 如果专门的预告片集合没有数据，则从其他数据源中查找
    const trailers: VideoItem[] = []
    const processedIds = new Set()

    // 处理genres数据
    for (const category in genresData) {
      const animeList = genresData[category]
      for (const anime of animeList) {
        if (
          anime.trailer &&
          anime.trailer.id &&
          anime.trailer.site === "youtube" &&
          !processedIds.has(anime.trailer.id)
        ) {
          trailers.push({
            id: anime.trailer.id,
            title: "预告片",
            thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
            url: `https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${anime.trailer.id}`,
            animeTitle: anime.title.romaji || anime.title.english,
          })
          processedIds.add(anime.trailer.id)
        }
      }
    }

    if (trailers.length === 0) return null

    // 返回随机预告片
    return trailers[Math.floor(Math.random() * trailers.length)]
  } catch (error) {
    console.error("Error getting random trailer:", error)
    return null
  }
}

// 获取多个随机预告片
export async function getMultipleRandomTrailers(count = 5): Promise<VideoItem[]> {
  try {
    const trailers: VideoItem[] = []
    const processedIds = new Set()

    // 首先尝试从专门的预告片集合中获取
    if (trailersData && trailersData.length > 0) {
      // 随机打乱预告片数组
      const shuffledTrailers = [...trailersData].sort(() => 0.5 - Math.random())

      for (const anime of shuffledTrailers) {
        if (
          anime.trailer &&
          anime.trailer.id &&
          anime.trailer.site === "youtube" &&
          !processedIds.has(anime.trailer.id)
        ) {
          trailers.push({
            id: anime.trailer.id,
            title: "预告片",
            thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
            url: `https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${anime.trailer.id}`,
            animeTitle: anime.title.romaji || anime.title.english,
          })

          processedIds.add(anime.trailer.id)

          // 如果已经收集了足够的预告片，就返回
          if (trailers.length >= count) {
            return trailers
          }
        }
      }
    }

    // 如果专门的预告片集合没有足够的数据，则从其他数据源中查找
    const processDataSource = (data: any) => {
      for (const category in data) {
        const animeList = data[category]
        for (const anime of animeList) {
          if (
            anime.trailer &&
            anime.trailer.id &&
            anime.trailer.site === "youtube" &&
            !processedIds.has(anime.trailer.id)
          ) {
            trailers.push({
              id: anime.trailer.id,
              title: "预告片",
              thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
              url: `https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${anime.trailer.id}`,
              animeTitle: anime.title.romaji || anime.title.english,
            })

            processedIds.add(anime.trailer.id)

            // 如果已经收集了足够的预告片，就返回
            if (trailers.length >= count) {
              return true
            }
          }
        }
      }
      return false
    }

    // 按顺序处理各个数据源
    if (processDataSource(genresData)) return trailers
    if (processDataSource(formatsData)) return trailers
    if (processDataSource(yearsData)) return trailers
    if (processDataSource(statusData)) return trailers

    return trailers
  } catch (error) {
    console.error("Error getting multiple random trailers:", error)
    return []
  }
}

// 获取所有预告片
export async function getAllTrailers(): Promise<VideoItem[]> {
  try {
    const trailers: VideoItem[] = []
    const processedIds = new Set()

    // 首先从专门的预告片集合中获取
    if (trailersData && trailersData.length > 0) {
      for (const anime of trailersData) {
        if (
          anime.trailer &&
          anime.trailer.id &&
          anime.trailer.site === "youtube" &&
          !processedIds.has(anime.trailer.id)
        ) {
          trailers.push({
            id: anime.trailer.id,
            title: "预告片",
            thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
            url: `https://www.youtube.com/watch?v=${anime.trailer.id}`,
            animeTitle: anime.title.romaji || anime.title.english,
          })
          processedIds.add(anime.trailer.id)
        }
      }
    }

    // 如果需要更多预告片，从其他数据源中获取
    const processDataSource = (data: any) => {
      for (const category in data) {
        const animeList = data[category]
        for (const anime of animeList) {
          if (
            anime.trailer &&
            anime.trailer.id &&
            anime.trailer.site === "youtube" &&
            !processedIds.has(anime.trailer.id)
          ) {
            trailers.push({
              id: anime.trailer.id,
              title: "预告片",
              thumbnail: anime.trailer.thumbnail || anime.coverImage.extraLarge,
              url: `https://www.youtube.com/watch?v=${anime.trailer.id}`,
              animeTitle: anime.title.romaji || anime.title.english,
            })
            processedIds.add(anime.trailer.id)
          }
        }
      }
    }

    // 处理各个数据源
    processDataSource(genresData)
    processDataSource(formatsData)
    processDataSource(yearsData)
    processDataSource(statusData)

    return trailers
  } catch (error) {
    console.error("Error getting all trailers:", error)
    return []
  }
}

// 获取统计数据
export async function getStatsData() {
  try {
    // 计算不重复的动漫总数（使用ID去重）
    const animeIds = new Set()
    for (const genre in genresData) {
      for (const anime of genresData[genre]) {
        animeIds.add(anime.id)
      }
    }

    const totalAnime = animeIds.size
    const totalGenres = Object.keys(genresData).length

    // 计算视频总数
    const trailers = await getAllTrailers()
    const totalVideos = trailers.length

    return {
      totalAnime,
      totalGenres,
      totalVideos,
    }
  } catch (error) {
    console.error("Error getting stats data:", error)
    return {
      totalAnime: 0,
      totalGenres: 0,
      totalVideos: 0,
    }
  }
}
