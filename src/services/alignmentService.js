import { supabase } from '@lib/supabase'
import { WORLD_FROM_KEY } from '@constants/quiz'

const WORLD_KEYS = ['haven', 'tools', 'oasis', 'nexus']

/**
 * Pure function: turn an array of selected quiz responses into a normalized
 * alignment object that always sums to 100. Kept side-effect free so it can
 * run client-side for instant feedback and be unit-tested in isolation.
 *
 * @param {Array<{questionId, optionId, weights}>} responses
 * @returns {{ haven_pct, tools_pct, oasis_pct, nexus_pct, primary_world }}
 */
export const calculateAlignment = (responses) => {
  const totals = { haven: 0, tools: 0, oasis: 0, nexus: 0 }
  for (const r of responses) {
    for (const k of WORLD_KEYS) totals[k] += r.weights?.[k] || 0
  }

  const sum = WORLD_KEYS.reduce((acc, k) => acc + totals[k], 0) || 1

  // Round each percentage, then fix any rounding drift on the largest bucket
  // so the four values always add up to exactly 100.
  const raw = WORLD_KEYS.map((k) => ({ k, pct: (totals[k] / sum) * 100 }))
  const rounded = raw.map((r) => ({ ...r, pct: Math.round(r.pct) }))
  const drift = 100 - rounded.reduce((a, b) => a + b.pct, 0)
  if (drift !== 0) {
    const target = rounded.reduce((a, b) => (b.pct >= a.pct ? b : a))
    target.pct += drift
  }

  const map = Object.fromEntries(rounded.map((r) => [r.k, r.pct]))
  const primaryKey = rounded.reduce((a, b) => (b.pct > a.pct ? b : a)).k

  return {
    haven_pct: map.haven,
    tools_pct: map.tools,
    oasis_pct: map.oasis,
    nexus_pct: map.nexus,
    primary_world: WORLD_FROM_KEY[primaryKey],
  }
}

/**
 * Persist a completed quiz attempt:
 *   1. append every selected option to quiz_responses (audit trail)
 *   2. upsert the user's world_alignment row
 *   3. denormalize primary_world + quiz_completed_at onto users
 */
export const submitQuiz = async (userId, attemptId, responses) => {
  if (!userId) throw new Error('submitQuiz requires a signed-in user')

  const alignment = calculateAlignment(responses)

  // 1. responses
  const responseRows = responses.map((r) => ({
    user_id: userId,
    attempt_id: attemptId,
    question_id: r.questionId,
    option_id: r.optionId,
    weights: r.weights,
  }))
  const { error: respErr } = await supabase
    .from('quiz_responses')
    .insert(responseRows)
  if (respErr) throw respErr

  // 2. alignment (upsert)
  const { error: alignErr } = await supabase
    .from('world_alignment')
    .upsert(
      { user_id: userId, ...alignment, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
  if (alignErr) throw alignErr

  // 3. denormalize on users
  const { error: userErr } = await supabase
    .from('users')
    .update({
      primary_world: alignment.primary_world,
      quiz_completed_at: new Date().toISOString(),
    })
    .eq('id', userId)
  if (userErr) throw userErr

  return alignment
}

export const getAlignment = async (userId) => {
  if (!userId) return null
  const { data, error } = await supabase
    .from('world_alignment')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    console.error('getAlignment error:', error.message)
    return null
  }
  return data
}

/**
 * Public profile fetcher — joins users + world_alignment in one round trip.
 * Username lookup is case-insensitive.
 */
export const getProfileByUsername = async (username) => {
  if (!username) return null
  const { data, error } = await supabase
    .from('users')
    .select('id, username, display_name, bio, primary_world, quiz_completed_at, world_alignment(*)')
    .ilike('username', username)
    .maybeSingle()
  if (error) {
    console.error('getProfileByUsername error:', error.message)
    return null
  }
  if (!data) return null
  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name,
    bio: data.bio,
    primaryWorld: data.primary_world,
    quizCompletedAt: data.quiz_completed_at,
    alignment: Array.isArray(data.world_alignment)
      ? data.world_alignment[0]
      : data.world_alignment,
  }
}

// ----- Pending alignment (anonymous quiz takers) -----------------------------

const PENDING_KEY = 'fw.pending_alignment'

export const stashPendingAlignment = (payload) => {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(payload))
  } catch {}
}

export const readPendingAlignment = () => {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const clearPendingAlignment = () => {
  try {
    localStorage.removeItem(PENDING_KEY)
  } catch {}
}

/** Flush a stored anonymous quiz attempt into the user's account. */
export const flushPendingAlignment = async (userId) => {
  const pending = readPendingAlignment()
  if (!pending || !userId) return null
  try {
    await submitQuiz(userId, pending.attemptId, pending.responses)
    clearPendingAlignment()
    return pending
  } catch (err) {
    console.error('flushPendingAlignment error:', err.message)
    return null
  }
}
