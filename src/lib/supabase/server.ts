// Stub for build compatibility. Replace with real implementation if needed.
// export function createServer() { /* ... */ }
export function createClient() {
	// This is a stub. No-op for build.
	       return {
		       auth: {
			       async exchangeCodeForSession(_code: string) {
				       // Do nothing, always return no error
				       return { error: null };
			       },
			       async signOut() {
				       // Stub signOut for build compatibility
				       return { error: null };
			       }
		       }
	       };
}
