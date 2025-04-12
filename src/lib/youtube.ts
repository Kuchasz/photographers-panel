export const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2] && match[2].length === 11) ? match[2] : null
}

export const getVideoInfo = async (videoId: string) => {
    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
        const data = await response.json()
        return {
            title: data.title,
            description: data.description || '',
        }
    } catch (error) {
        console.error('Error fetching video info:', error)
        return null
    }
}

export const convertToEmbedUrl = (url: string): string => {
    const videoId = extractVideoId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
} 