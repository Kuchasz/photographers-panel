import type { Payload } from 'payload'
import { BLACKLISTED_EMAILS_SLUG } from '~/collections/collectionSlugs'

export const isEmailBlacklisted = async (payload: Payload, email: string): Promise<boolean> => {
  try {
    const normalizedEmail = email.toLowerCase().trim()

    const result = await payload.find({
      collection: BLACKLISTED_EMAILS_SLUG,
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

export const isBotMessage = (weddingDate?: string): boolean => {
  if (!weddingDate || weddingDate.trim() === '') {
    return false
  }

  try {

    const parsedDate = new Date(weddingDate)

    if (isNaN(parsedDate.getTime())) {
      return true // Invalid date format, likely bot
    }

    const now = new Date()
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    const fiveYearsFromNow = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate())

    // If date is more than 1 year ago or more than 5 years in future, likely bot
    if (parsedDate < oneYearAgo || parsedDate > fiveYearsFromNow) {
      return true
    }

    return false // Valid date within reasonable range
  } catch (error) {
    // If parsing throws an error, likely bot
    return true
  }
}

export const addEmailToBlacklist = async (
  payload: Payload,
  email: string,
  reason: 'spam' | 'bot' | 'invalid' | 'user-request' | 'bounced' | 'other',
  notes?: string
): Promise<void> => {
  try {
    const normalizedEmail = email.toLowerCase().trim()

    await payload.create({
      collection: BLACKLISTED_EMAILS_SLUG,
      data: {
        email: normalizedEmail,
        reason,
        notes,
      },
    })
  } catch (error) {
    console.error('Error adding email to blacklist:', error)
    throw error
  }
} 