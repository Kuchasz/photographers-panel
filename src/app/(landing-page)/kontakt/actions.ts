"use server";

import { type Message, send } from "~/areas/message";
import { type SendResult } from "~/areas/message";
import { getPayload } from "payload";
import config from "~/payload.config";
import { WEBSITE_INQUIRIES_SLUG } from "~/collections/collectionSlugs";
import { isEmailBlacklisted } from "~/lib/blacklist";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type ContactState = {
    formData: Message;
    isSubmitting: boolean;
    result?: SendResult;
};

export async function sendMessage(
    prevState: ContactState,
    formData: FormData
): Promise<ContactState> {
    // Extract form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const weddingDate = formData.get('weddingDate') as string;
    const weddingPlace = formData.get('weddingPlace') as string;
    const weddingVenue = formData.get('weddingVenue') as string;
    const howDidYouHear = formData.get('howDidYouHear') as string;
    const additionalDetails = formData.get('additionalDetails') as string;

    const messageData: Message = {
        name,
        email,
        weddingDate: weddingDate || undefined,
        weddingPlace: weddingPlace || undefined,
        weddingVenue: weddingVenue || undefined,
        howDidYouHear: howDidYouHear || undefined,
        additionalDetails: additionalDetails || undefined,
    };

    // Store inquiry in database
    const payload = await getPayload({ config });

    // Check if email is blacklisted before sending
    try {
        const isBlacklisted = await isEmailBlacklisted(payload, messageData.email);
        if (isBlacklisted) {
            await wait(2000);
            console.log('Email sending skipped - email is blacklisted:', messageData.email);
            // Return success to avoid revealing that the email is blacklisted
            return {
                formData: {
                    name: '',
                    email: '',
                    weddingDate: '',
                    weddingPlace: '',
                    weddingVenue: '',
                    howDidYouHear: '',
                    additionalDetails: '',
                },
                isSubmitting: false,
                result: { type: 'success' }
            };
        }
    } catch (error) {
        console.error('Error checking blacklist:', error);
        // Continue with email sending if blacklist check fails
    }

    await payload.create({
        collection: WEBSITE_INQUIRIES_SLUG,
        data: {
            ...messageData,
            date: new Date().toISOString(),
        },
    });

    await wait(1500);

    try {
        const result = await send(messageData);

        // If successful, clear form data
        if (result.type === 'success') {
            return {
                formData: {
                    name: '',
                    email: '',
                    weddingDate: '',
                    weddingPlace: '',
                    weddingVenue: '',
                    howDidYouHear: '',
                    additionalDetails: '',
                },
                isSubmitting: false,
                result
            };
        }

        // If error, maintain form data
        return {
            formData: messageData,
            isSubmitting: false,
            result
        };
    } catch (error) {
        console.error('Failed to send message:', error);
        return {
            formData: messageData,
            isSubmitting: false,
            result: { type: 'error', error: 'InternalError' }
        };
    }
}