import type { ClientAccount, Lead, Proposal } from '@/lib/db'
import type { RequestSession } from '@/lib/auth/server-session'

export function canAccessClient(session: RequestSession, client: ClientAccount): boolean {
  if (session.role === 'admin') return true
  return client.assigned_user_ids.includes(session.userId)
}

export function canAccessLead(
  session: RequestSession,
  lead: Lead,
  assignedClientIds: Set<string>
): boolean {
  if (session.role === 'admin') return true
  if (lead.owner_user_id && lead.owner_user_id === session.userId) return true
  if (lead.client_id) return assignedClientIds.has(lead.client_id)
  return false
}

export function canAccessProposal(
  session: RequestSession,
  proposal: Proposal,
  assignedClientIds: Set<string>
): boolean {
  if (session.role === 'admin') return true
  if (proposal.owner_user_id && proposal.owner_user_id === session.userId) return true
  if (proposal.client_id) return assignedClientIds.has(proposal.client_id)
  return false
}
