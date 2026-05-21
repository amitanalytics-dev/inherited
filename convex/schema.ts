import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  founder_responses: defineTable({
    submittedAt: v.string(),
    responses: v.any(),
  }),
})
