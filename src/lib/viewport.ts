import { useState, useEffect } from "react";

interface ViewportSize {
    width: number;
    height: number;
}

export function useViewportSize(): ViewportSize {
    const [size, setSize] = useState<ViewportSize>({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
}
