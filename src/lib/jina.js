export async function fetchUrlContent(url) {
  const jinaUrl = `https://r.jina.ai/${url}`
  const response = await fetch(jinaUrl, {
    headers: {
      Accept: 'text/plain',
    },
  })

  if (!response.ok) {
    throw new Error('JINA_ERROR')
  }

  const text = await response.text()
  if (!text || text.trim().length < 50) {
    throw new Error('JINA_ERROR')
  }

  return text
}
