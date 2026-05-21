import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const save = mutation({
  args: { responses: v.any() },
  handler: async (ctx, args) => {
    await ctx.db.insert('founder_responses', {
      submittedAt: new Date().toISOString(),
      responses: args.responses,
    })
  },
})

export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('founder_responses')
      .order('desc')
      .first()
  },
})
