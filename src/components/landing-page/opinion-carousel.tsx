'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "@phosphor-icons/react";
import { type Opinion } from "~/app/(landing-page)/actions";
import { strings } from "~/resources";
import { NavigationButton } from "./navigation-button";

export const OpinionCarousel = ({ opinions }: { opinions: Opinion[] }) => {
    const [currentOpinionIndex, setCurrentOpinionIndex] = useState(0);

    useEffect(() => {
        if (opinions.length === 0) return;

        const timer = setInterval(() => {
            setCurrentOpinionIndex((prev) => (prev + 1) % opinions.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [opinions]);

    // Display a fallback message when no opinions are available
    if (opinions.length === 0) {
        return (
            <div className="mx-auto max-w-5xl">
                <div className="min-h-[200px] rounded-lg bg-white p-8 shadow-lg flex items-center justify-center">
                    <p className="text-center font-light text-stone-500">No opinions available at the moment.</p>
                </div>
            </div>
        );
    }

    const goToPrevOpinion = () => {
        setCurrentOpinionIndex((prev) => (prev - 1 + opinions.length) % opinions.length);
    };

    const goToNextOpinion = () => {
        setCurrentOpinionIndex((prev) => (prev + 1) % opinions.length);
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="relative min-h-[450px] overflow-hidden rounded-lg shadow-md">
                <div
                    style={{
                        transform: `translateX(${currentOpinionIndex * -100}%)`,
                    }}
                    className="absolute inset-0 flex w-full transition-transform duration-500"
                >
                    {opinions.map((opinion, index) => (
                        <div
                            key={opinion.id}
                            style={{
                                transform: `translateX(${index * 100}%)`,
                            }}
                            className={`absolute w-full h-full grid grid-cols-1 md:grid-cols-2 transition-opacity duration-500 ${index === currentOpinionIndex ? "opacity-100" : "opacity-0"}`}
                        >
                            {/* Left side - Photo */}
                            <div className="w-full md:h-full bg-stone-100 overflow-hidden relative">
                                <Image
                                    fill
                                    src={opinion.media?.url ?? "https://mangostudios.com/wp-content/uploads/2024/10/alessia-and-lucas.webp"}
                                    alt={opinion.media?.alt ?? `${opinion.author} testimonial`}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>

                            {/* Right side - Testimonial content */}
                            <div className="bg-white p-8 md:p-12 flex flex-col justify-between">
                                <div className="space-y-6">
                                    {/* Quote icon */}
                                    <div className="mb-6 text-gold-400 opacity-40">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                                            <path d="M9.58,13.69A4.83,4.83,0,0,1,8,17.94a6.91,6.91,0,0,1-5.33,2.2v-2.5a4.52,4.52,0,0,0,3.33-1.36,4.59,4.59,0,0,0,1.39-2.5H4.66V7.53h4.92Z" />
                                            <path d="M19.58,13.69A4.83,4.83,0,0,1,18,17.94a6.91,6.91,0,0,1-5.33,2.2v-2.5a4.52,4.52,0,0,0,3.33-1.36,4.59,4.59,0,0,0,1.39-2.5H14.66V7.53h4.92Z" />
                                        </svg>
                                    </div>

                                    {/* Customer Name */}
                                    <h3 className="font-serif text-3xl text-stone-800">{opinion.author}</h3>

                                    {/* Quote */}
                                    <p className="text-xl italic font-serif text-gold-600">&ldquo;{opinion.title}...&rdquo;</p>

                                    {/* Full testimonial */}
                                    <p className="font-light leading-relaxed text-stone-600">{opinion.content}</p>
                                </div>

                                <div className="mt-8 flex items-center justify-between">
                                    {/* Rating Stars */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: opinion.rating }).map((_, i) => (
                                            <Star key={i} size={18} weight="fill" className="text-gold-500" />
                                        ))}
                                    </div>

                                    {/* Source and Date */}
                                    <div className="text-right border-l border-stone-200 pl-4">
                                        <p className="text-sm font-light text-stone-500">
                                            {opinion.source in strings.opinions.sources
                                                ? strings.opinions.sources[opinion.source as keyof typeof strings.opinions.sources]
                                                : opinion.source}
                                            {" · "}
                                            {opinion.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation controls */}
            <div className="mt-8 flex justify-center gap-4">
                <div className="flex items-center space-x-4">
                    <NavigationButton
                        direction="left"
                        onClick={goToPrevOpinion}
                        ariaLabel="Previous opinion"
                    />

                    <div className="flex gap-3">
                        {opinions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentOpinionIndex(index)}
                                className={`h-3 w-3 rounded-full transition-all ${index === currentOpinionIndex
                                    ? "bg-gold-500 scale-110"
                                    : "bg-stone-200 hover:bg-stone-300"
                                    }`}
                                aria-label={`Go to opinion ${index + 1}`}
                            />
                        ))}
                    </div>

                    <NavigationButton
                        direction="right"
                        onClick={goToNextOpinion}
                        ariaLabel="Next opinion"
                    />
                </div>
            </div>
        </div>
    );
}; 