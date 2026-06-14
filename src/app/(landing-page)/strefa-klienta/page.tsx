import Image from "next/image";
import Link from "next/link";
import { FormLabel } from "~/components/form";
import { FormButton } from "~/components/form/button";
import { PageContainer } from "~/components/page-container";
import { SectionTitle } from "~/components/section-title";
import { isPrivateGalleryLoginStatus, type PrivateGalleryLoginStatus } from "~/lib/private-gallery-login-status";
import { strings } from "~/resources";
import { loginToPrivateGallery } from "./actions";
import { PasswordIcon } from "./password-icon";

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
                className: 'border-red-100 bg-red-50 text-red-800',
                message: strings.privateGallery.notExists.description,
            };
        case 'draft':
            return {
                className: 'border-yellow-100 bg-yellow-50 text-yellow-800',
                message: strings.privateGallery.notReady.description,
            };
        case 'archived':
            return {
                className: 'border-yellow-100 bg-yellow-50 text-yellow-800',
                message: strings.privateGallery.turnedOff.description,
            };
        case 'session-expired':
            return {
                className: 'border-yellow-100 bg-yellow-50 text-yellow-800',
                message: strings.privateGallery.sessionExpired.description,
            };
        case 'error':
            return {
                className: 'border-red-100 bg-red-50 text-red-800',
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
                            <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-stone-100 text-center">
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

            {/* Hero Section */}
            <section className="w-full bg-section-background py-12 mb-12 rounded-lg shadow-sm">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
                        {/* Content Section */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="font-serif text-4xl font-light tracking-wide text-stone-800 md:text-5xl">
                                    {strings.privateGallery.title}
                                </h1>
                                <h2 className="text-xl font-light text-stone-600 leading-relaxed">
                                    {strings.privateGallery.subtitle}
                                </h2>
                                <p className="font-light leading-relaxed text-stone-600">
                                    {strings.privateGallery.intro}
                                </p>
                            </div>

                            {/* Authentication Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                                <form action={loginToPrivateGallery} className="space-y-6">
                                    <div className="space-y-2">
                                        <FormLabel htmlFor="password" required>
                                            {strings.privateGallery.password}
                                        </FormLabel>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <PasswordIcon />
                                            </div>
                                            <input
                                                id="password"
                                                type="password"
                                                name="password"
                                                className="w-full rounded-lg border border-stone-200 bg-white pl-10 px-4 py-3 text-stone-800 
                                                    outline-none transition duration-200 placeholder:text-stone-400 
                                                    hover:border-stone-300 focus:border-gold-300 focus:ring-1 focus:ring-gold-200"
                                                placeholder="Wprowadź hasło do galerii..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    <FormButton>
                                        {strings.privateGallery.check}
                                    </FormButton>
                                </form>

                                {feedback && (
                                    <div className={`mt-4 rounded-lg border p-4 ${feedback.className}`}>
                                        <p className="text-sm">
                                            {feedback.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 shadow-lg md:aspect-auto md:h-[480px]">
                            <Image
                                src="/images/page_prywatna_photo.jpg"
                                alt={strings.privateGallery.imageAlt}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Help Section */}
            <section className="w-full py-8 mb-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-lg p-8 shadow-md border border-stone-100 text-center">
                        <h3 className="text-2xl font-medium text-stone-800 mb-4">{strings.privateGallery.help.title}</h3>
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
