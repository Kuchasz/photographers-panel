'use client';

import { useId, useState } from 'react';
import { FormLabel } from '~/components/form';
import { FormButton } from '~/components/form/button';
import { strings } from '~/resources';
import { loginToPrivateGallery } from './actions';
import { PasswordIcon } from './password-icon';

type Feedback = {
    tone: 'error' | 'warning';
    message: string;
} | null;

type PasswordAccessFormProps = {
    feedback: Feedback;
};

export function PasswordAccessForm({ feedback }: PasswordAccessFormProps) {
    const passwordId = useId();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const feedbackStyles =
        feedback?.tone === 'error'
            ? {
                  container: 'border-gold-300/80 bg-gold-100/80 text-stone-800',
                  marker: 'bg-gold-700',
              }
            : {
                  container: 'border-stone-200 bg-stone-50/90 text-stone-700',
                  marker: 'bg-gold-500',
              };

    return (
        <div className="rounded-2xl border border-white/60 bg-white/90 p-5 text-stone-900 shadow-2xl shadow-black/25 backdrop-blur-md sm:p-7">
            <form action={loginToPrivateGallery} className="space-y-4">
                <div className="space-y-2">
                    <FormLabel htmlFor={passwordId} required className="text-stone-600">
                        {strings.privateGallery.passwordPrompt.password}
                    </FormLabel>
                    <div className="relative flex items-center">
                        <div className="pointer-events-none absolute left-4 flex items-center">
                            <PasswordIcon />
                        </div>
                        <input
                            id={passwordId}
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="password"
                            autoComplete="off"
                            className="min-h-14 w-full rounded-lg border border-stone-300 bg-white px-16 py-3 pl-12 text-stone-800 outline-none transition duration-200 placeholder:text-stone-400 hover:border-stone-400 focus:border-gold-500 focus:ring-4 focus:ring-gold-200/70"
                            placeholder={strings.privateGallery.passwordPrompt.placeholder}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible((current) => !current)}
                            aria-label={isPasswordVisible ? 'Ukryj hasło' : 'Pokaż hasło'}
                            className="absolute right-2 min-h-10 rounded-full px-3 text-xs font-medium uppercase tracking-widest text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 focus:outline-none focus:ring-2 focus:ring-gold-300"
                        >
                            {isPasswordVisible ? 'Ukryj' : 'Pokaż'}
                        </button>
                    </div>
                </div>

                <FormButton className="min-h-14 rounded-lg bg-gold-700 tracking-widest hover:bg-gold-800 focus:ring-gold-400">
                    {strings.privateGallery.passwordPrompt.submit}
                </FormButton>

                <div className="flex flex-col gap-1 text-sm font-light text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span>{strings.privateGallery.passwordPrompt.helper}</span>
                    <span>{strings.privateGallery.passwordPrompt.emptyStatus}</span>
                </div>
            </form>

            {feedback && (
                <div className={`mt-4 rounded-lg border px-4 py-3 ${feedbackStyles.container}`}>
                    <p className="flex gap-3 text-sm font-light leading-relaxed">
                        <span
                            className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${feedbackStyles.marker}`}
                            aria-hidden="true"
                        />
                        <span>{feedback.message}</span>
                    </p>
                </div>
            )}
        </div>
    );
}
