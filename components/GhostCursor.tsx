import React, { useEffect, useState } from 'react';

const GhostCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState<{ x: number, y: number, id: number }[]>([]);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            setTrail(prev => [
                ...prev,
                { x: e.clientX, y: e.clientY, id: Date.now() }
            ].slice(-15)); // Keep last 15 points
        };

        window.addEventListener('mousemove', updatePosition);
        return () => window.removeEventListener('mousemove', updatePosition);
    }, []);

    return (
        <>
            {/* Main Ghost Cursor */}
            <div
                className="fixed w-6 h-6 rounded-full border-2 border-white pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
                style={{ left: position.x, top: position.y }}
            />
            <div
                className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-[9999] mix-blend-screen -translate-x-1/2 -translate-y-1/2 blur-[2px]"
                style={{ left: position.x, top: position.y }}
            />

            {/* Ghost Trail */}
            {trail.map((point, index) => (
                <div
                    key={point.id}
                    className="fixed w-4 h-4 rounded-full pointer-events-none z-[9998] mix-blend-screen opacity-50 bg-purple-500 blur-sm transition-all duration-300 -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: point.x,
                        top: point.y,
                        transform: `scale(${index / 15})`, // Shrink older points
                        opacity: index / 20
                    }}
                />
            ))}
        </>
    );
};

export default GhostCursor;
