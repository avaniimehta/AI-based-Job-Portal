const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'mistral';

export async function ollamaStream(prompt, onChunk, onDone, onError) {
  try {
    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt, stream: true }),
    });
    if (!res.ok) throw new Error(`Ollama responded with status ${res.status}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) { full += json.response; onChunk(full); }
          if (json.done) { onDone(full); return; }
        } catch {}
      }
    }
    onDone(full);
  } catch (err) {
    onError(err.message || 'Could not reach Ollama. Make sure it is running on port 11434.');
  }
}

export async function ollamaAsk(prompt) {
  return new Promise((resolve, reject) => {
    let result = '';
    ollamaStream(prompt, t => { result = t; }, () => resolve(result), reject);
  });
}
