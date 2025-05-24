import type { Payload } from 'payload'
import { BLACKLISTED_EMAILS_SLUG } from '~/collections/collectionSlugs'

export const isEmailBlacklisted = async (payload: Payload, email: string): Promise<boolean> => {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    
    const result = await payload.find({
      collection: BLACKLISTED_EMAILS_SLUG as any,
      where: {
        email: {
          equals: normalizedEmail,
        },
      },
      limit: 1,
    })
    
    return result.docs.length > 0
  } catch (error) {
    console.error('Error checking blacklisted email:', error)
    return false
  }
}

export const addEmailToBlacklist = async (
  payload: Payload,
  email: string, 
  reason: 'spam' | 'invalid' | 'user-request' | 'bounced' | 'other',
  notes?: string
): Promise<void> => {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    
    await payload.create({
      collection: BLACKLISTED_EMAILS_SLUG as any,
      data: {
        email: normalizedEmail,
        reason,
        notes,
      } as any,
    })
  } catch (error) {
    console.error('Error adding email to blacklist:', error)
    throw error
  }
} 