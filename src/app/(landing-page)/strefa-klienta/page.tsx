import Image from 'next/image';
import Link from 'next/link';
import { PageContainer } from '~/components/page-container';
import { SectionTitle } from '~/components/section-title';
import { isPrivateGalleryLoginStatus, type PrivateGalleryLoginStatus } from '~/lib/private-gallery-login-status';
import { strings } from '~/resources';
import { PasswordAccessForm } from './password-access-form';

type PageProps = {
    searchParams?: Promise<{
        status?: string | string[];
    }>;
};

const getStatus = (status: string | string[] | undefined): PrivateGalleryLoginStatus | null => {
    const value = Array.isArray(status) ? status[0] : status;

    if (isPrivateGalleryLoginStatus(value)) {
        return value;
    }

    return null;
};

const getFeedback = (status: PrivateGalleryLoginStatus | null) => {
    switch (status) {
        case 'not-found':
            return {
                tone: 'error' as const,
                message: strings.privateGallery.notExists.description,
            };
        case 'draft':
            return {
                tone: 'warning' as const,
                message: strings.privateGallery.notReady.description,
            };
        case 'archived':
            return {
                tone: 'warning' as const,
                message: strings.privateGallery.turnedOff.description,
            };
        case 'session-expired':
            return {
                tone: 'warning' as const,
                message: strings.privateGallery.sessionExpired.description,
            };
        case 'error':
            return {
                tone: 'error' as const,
                message: strings.privateGallery.unavailable,
            };
        default:
            return null;
    }
};

export default async function PrivateGallery({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const feedback = getFeedback(getStatus(resolvedSearchParams?.status));

    return (
        <PageContainer>
            {/* How It Works Section */}
            <section className="w-full pb-12 mb-12">
                <div className="max-w-5xl mx-auto px-4">
                    <SectionTitle
                        title={strings.privateGallery.howItWorks.title}
                        subtitle={strings.privateGallery.howItWorks.subtitle}
                    />

                    <div className="grid md:grid-cols-3 gap-8 my-12">
                        {strings.privateGallery.howItWorks.steps.map((step, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-6 shadow-md border border-stone-100 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-600 mb-4">
                                    <span className="text-xl font-serif">{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-medium text-stone-800 mb-3">{step.title}</h3>
                                <p className="text-stone-600 font-light">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Password Prompt Section */}
            <section className="relative mb-12 min-h-[560px] w-full overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
                <Image
                    src="/images/page_prywatna_photo.jpg"
                    alt={strings.privateGallery.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/45 to-stone-950/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                <div className="relative z-10 grid min-h-[560px] items-end gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] md:p-12 lg:p-16">
                    <div className="max-w-2xl space-y-4 text-white">
                        <p className="text-xs font-bold uppercase tracking-[0.4em] text-white">
                            {strings.privateGallery.passwordPrompt.kicker}
                        </p>
                        <h1 className="font-serif text-5xl font-normal uppercase leading-none tracking-wider md:text-6xl">
                            {strings.privateGallery.passwordPrompt.title}
                        </h1>
                        <p className="max-w-xl text-lg font-light leading-relaxed text-white/85">
                            {strings.privateGallery.passwordPrompt.description}
                        </p>
                    </div>

                    <PasswordAccessForm feedback={feedback} />
                </div>
            </section>

            {/* Help Section */}
            <section className="w-full py-8 mb-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-lg p-8 shadow-md border border-stone-100 text-center">
                        <h3 className="text-2xl font-medium text-stone-800 mb-4">
                            {strings.privateGallery.help.title}
                        </h3>
                        <p className="text-stone-600 font-light mb-6">{strings.privateGallery.help.description}</p>
                        <Link
                            href="/kontakt"
                            className="inline-block rounded-lg bg-gold-500 px-8 py-3 text-center font-medium text-white transition duration-200 hover:bg-gold-600"
                        >
                            {strings.privateGallery.help.contact}
                        </Link>
                    </div>
                </div>
            </section>
        </PageContainer>
    );
}
