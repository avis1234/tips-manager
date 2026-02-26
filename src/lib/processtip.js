import { fetchUrlContent } from './jina.js'
import { analyzeTip } from './claude.js'
import { getSupabaseClient } from './supabase.js'

export async function processTip({ rawInput, entryType, settings, onStatus }) {
  const { claudeApiKey, supabaseUrl, supabaseAnonKey } = settings

  let content = rawInput
  let sourceUrl = null

  // Step 1: If link, fetch content via Jina
  if (entryType === 'link') {
    onStatus('fetching')
    try {
      content = await fetchUrlContent(rawInput)
      sourceUrl = rawInput
    } catch {
      throw new Error('JINA_ERROR')
    }
  }

  // Step 2: Analyze with Claude
  onStatus('analyzing')
  let analysis
  try {
    analysis = await analyzeTip(content, entryType, claudeApiKey)
  } catch (err) {
    throw err
  }

  // Step 3: Build the tip excerpt
  let tipExcerpt
  if (entryType === 'link') {
    tipExcerpt = analysis.pageTitle || rawInput
  } else {
    tipExcerpt = rawInput.slice(0, 200)
  }

  // Step 4: Save to Supabase
  onStatus('saving')
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey)
  if (!supabase) {
    throw new Error('SUPABASE_ERROR')
  }

  const { error } = await supabase.from('tips').insert({
    entry_type: entryType,
    raw_input: rawInput,
    tool_name: analysis.toolName || null,
    date_created: analysis.dateCreated || null,
    tip_excerpt: tipExcerpt,
    summary: analysis.summary || null,
    quality: analysis.quality || null,
    source_url: sourceUrl,
    raw_content: entryType === 'link' ? content : null,
  })

  if (error) {
    throw new Error('SUPABASE_ERROR')
  }
}
