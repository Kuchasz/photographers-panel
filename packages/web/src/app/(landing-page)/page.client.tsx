"use client";

import { useEffect, useState } from "react";
import { type Opinion } from "./actions";
import { Star } from "@phosphor-icons/react";
import { strings } from "~/resources";

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
            <div className="mx-auto max-w-3xl">
                <div className="min-h-[200px] rounded-lg bg-white p-8 shadow-lg flex items-center justify-center">
                    <p className="text-center font-light text-stone-500">No opinions available at the moment.</p>
                </div>
            </div>
        );
    }

    return <div className="mx-auto max-w-3xl">
        <div className="relative min-h-[200px] overflow-hidden rounded-lg bg-white p-8 shadow-lg">
            {opinions.map((opinion, index) => (
                <div
                    key={opinion.id}
                    className={`absolute inset-0 flex transform flex-col justify-between p-8 transition-all duration-500 ${index === currentOpinionIndex ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                        }`}
                >
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="font-serif text-xl font-light text-stone-800">{opinion.author}</p>
                                <p className="text-sm font-light text-stone-500">{strings.opinions.sources[opinion.source]}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: opinion.rating }).map((_, i) => (
                                    <Star key={i} size={16} weight="fill" className="text-yellow-400" />
                                ))}
                            </div>
                        </div>
                        <p className="font-light leading-relaxed text-stone-600">{opinion.content}</p>
                    </div>
                    <p className="text-right text-sm font-light text-stone-400">{opinion.date}</p>
                </div>
            ))}
        </div>
        <div className="mt-6 flex justify-center gap-2">
            {opinions.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentOpinionIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${index === currentOpinionIndex ? "bg-stone-400" : "bg-stone-200"
                        }`}
                    aria-label={`Go to opinion ${index + 1}`}
                />
            ))}
        </div>
    </div>
};
