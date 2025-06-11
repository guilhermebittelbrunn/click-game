'use client';

import { FaRobot } from 'react-icons/fa';
import { useEffect, useRef } from 'react';

interface IRobotProps {
    onTick: () => void;
}

export default function Robot({ onTick }: IRobotProps) {
    const robotRef = useRef<HTMLDivElement>(null);
    const hasTicked = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const robot = robotRef.current;
            if (robot) {
                const animation = robot.getAnimations()[0];
                if (animation) {
                    const currentTime = Number(animation.currentTime) || 0;
                    const duration = Number(animation.effect?.getComputedTiming().duration) || 5000;
                    const progress = (currentTime % duration) / duration;

                    // Reset hasTicked when we're not in the target range
                    if (progress < 0.59 || progress > 0.61) {
                        hasTicked.current = false;
                    }

                    // Execute tick when we reach the target range and haven't ticked yet
                    if (progress >= 0.59 && progress <= 0.61 && !hasTicked.current) {
                        hasTicked.current = true;
                        onTick();
                    }
                }
            }
        }, 50); // Increased precision by checking more frequently

        return () => clearInterval(interval);
    }, [onTick]);

    return (
        <div className="mt-8 rounded-lg p-3 w-full max-w-lg flex flex-row justify-center items-center">
            <div className="flex items-center gap-2" ref={robotRef}>
                <FaRobot className="w-10 h-10 text-color-value" />
            </div>
        </div>
    );
}
