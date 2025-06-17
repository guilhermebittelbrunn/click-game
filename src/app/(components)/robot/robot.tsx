'use client';

import { FaRobot } from 'react-icons/fa';
import { useEffect } from 'react';

interface IRobotProps {
    onTick: () => void;
    enabled: boolean;
}

export default function Robot({ onTick, enabled }: IRobotProps) {
    useEffect(() => {
        if (enabled) {
            const interval = setInterval(onTick, 4000);
            return () => clearInterval(interval);
        }
    }, [onTick, enabled]);

    return (
        <div className="mt-8 rounded-lg p-3 w-full max-w-lg flex flex-row justify-center items-center">
            <div className="flex items-center gap-2">
                <FaRobot className="w-10 h-10 text-color-value" />
            </div>
        </div>
    );
}
