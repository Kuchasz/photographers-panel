import React, { useState, useEffect } from "react";
import { addMonths } from "@pp/utils/dist/date";
import { GalleryDto, getGalleriesList, getGalleryVisits } from "@pp/api/dist/panel/private-gallery";
import { VisitsSummaryDto } from "@pp/api/dist/panel/visits";

interface GalleriesStateProps {}

export const GalleriesState: React.FC<GalleriesStateProps> = () => {
    const [selectedGallery, setSelectedGallery] = useState<number>(0);
    const [galleries, setGalleries] = useState<GalleryDto[]>([]);
    const [disableAutoDate, setDisableAutoDate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [stats, setStats] = useState<any>(null);
    const [visits, setVisits] = useState<VisitsSummaryDto[]>([]);

    useEffect(() => {
        getGalleriesList().then((galleries) => {
            const firstGalleryId = galleries[0]?.id;

            setGalleries(galleries);

            if (firstGalleryId) {
                onGallerySelected(firstGalleryId);
            }
        });
    }, []);

    const onGallerySelected = (galleryId: number) => {
        if (galleryId === selectedGallery) return;

        const gallery = galleries.find((x) => x.id === galleryId);
        
        if (!gallery) return;

        const newStartDate = disableAutoDate ? startDate : new Date(gallery.date);
        const newEndDate = disableAutoDate ? endDate : addMonths(new Date(gallery.date), 1);

        setIsLoading(true);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setSelectedGallery(galleryId);

        const randomStats = () => ({
            today: Math.floor(Math.random() * 300),
            total: Math.floor(Math.random() * 800),
            bestDay: '10/02/2010',
            days: 20 + Math.floor(Math.random() * 11),
            daysTotal: Math.floor(Math.random() * 100),
            emails: Math.floor(Math.random() * 20),
        });

        getGalleryVisits(newStartDate, newEndDate, galleryId).then((resp) => {
            setIsLoading(false);
            setStats(randomStats());
            setVisits(resp.dailyVisits);
        });
    };

    return (
        <div>
            {/* You can add your UI components here */}
            {/* This component seems to be primarily for state management */}
        </div>
    );
};
