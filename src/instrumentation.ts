export async function register() {
  // Only run in the Node.js server runtime, not the Edge runtime
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  // webpackIgnore tells the bundler to skip this — child_process is Node-only
  const { spawn } = await import(/* webpackIgnore: true */ 'child_process')

  // On Windows, Node resolves .exe automatically so shell:false is safe
  const cmd = process.platform === 'win32' ? 'ollama.exe' : 'ollama'
  const ollama = spawn(cmd, ['serve'], {
    detached: true,
    stdio: 'ignore',
  })

  ollama.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'ENOENT') {
      console.warn('[Ollama] ollama not found in PATH — install it from https://ollama.com')
    } else {
      // EADDRINUSE means it's already running — that's fine
      console.warn('[Ollama] Could not start:', err.message)
    }
  })

  // Detach so the Ollama process outlives any HMR restarts
  ollama.unref()

  console.log('[Ollama] Starting ollama serve...')
}
