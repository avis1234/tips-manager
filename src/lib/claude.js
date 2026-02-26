const MAX_CONTENT_LENGTH = 8000

const SYSTEM_PROMPT = `You are an expert at analyzing tips and content about AI tools and Claude.
Extract structured information and return ONLY valid JSON with no markdown, no code blocks, just raw JSON.`

const USER_PROMPT = (content, entryType) => `Analyze this ${entryType === 'link' ? 'web content' : 'tip text'} about an AI tool or Claude.

Content:
${content.slice(0, MAX_CONTENT_LENGTH)}

Return a JSON object with exactly these fields:
{
  "toolName": "Which tool this is about. One of: Claude Code, Claude.ai, Cursor, Windsurf, GitHub Copilot, ChatGPT, Gemini, General AI, or Other",
  "dateCreated": "The date this content was originally published or created in YYYY-MM-DD format, or null if unknown",
  "pageTitle": "The title of the page or article, or null if not applicable",
  "summary": "2-3 sentences. Be specific and actionable. Focus on what the user can actually DO with this tip.",
  "quality": "One of: Excellent, Good, Average, Weak — followed by a dash and a short reason. Example: 'Good - clear explanation of a useful workflow'"
}

Quality guide:
- Excellent: specific, actionable, novel insight with concrete examples
- Good: useful and clear, somewhat actionable
- Average: correct but vague or obvious
- Weak: generic, misleading, or lacks substance`

export async function analyzeTip(content, entryType, claudeApiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': claudeApiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: USER_PROMPT(content, entryType),
        },
      ],
    }),
  })

  if (response.status === 401) {
    throw new Error('CLAUDE_401')
  }
  if (response.status === 429) {
    throw new Error('CLAUDE_429')
  }
  if (!response.ok) {
    throw new Error('CLAUDE_ERROR')
  }

  const data = await response.json()
  const text = data.content[0].text.trim()

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('CLAUDE_BAD_JSON')
  }
}
