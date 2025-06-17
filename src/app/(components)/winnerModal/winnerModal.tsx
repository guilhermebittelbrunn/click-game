'use client';

import { Modal } from 'antd';
import { FaTrophy, FaCoins } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { useEffect, useMemo, useState } from 'react';
import { getClock } from '@/app/(helpers)/getClock';
import { FaClock } from 'react-icons/fa6';

const handleShowConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
};

interface IWinnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    score: number;
    money: number;
}

export default function WinnerModal({ isOpen, onClose, money }: IWinnerModalProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { timeToFinish, recordTime, isFirstTime } = useMemo(() => {
        const dateStart = localStorage.getItem('dateStart');
        const dateEnd = localStorage.getItem('dateEnd');
        const recordTime = localStorage.getItem('recordTime');
        const isFirstTime = !recordTime;

        const timeToFinish = Math.floor(
            new Date(dateEnd || '').getTime() - new Date(dateStart || '').getTime(),
        );

        return { timeToFinish, recordTime, isFirstTime };
    }, []);

    const handleReset = () => {
        localStorage.removeItem('score');
        localStorage.removeItem('money');
        localStorage.removeItem('upgrades');
        localStorage.removeItem('dateStart');
        window.location.reload();
    };

    useEffect(() => {
        if (!recordTime) {
            localStorage.setItem('recordTime', timeToFinish.toString());
        } else if (timeToFinish < Number(recordTime)) {
            localStorage.setItem('recordTime', timeToFinish.toString());
        }
    }, [timeToFinish, recordTime]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isOpen) {
            interval = setInterval(() => {
                handleShowConfetti();
            }, 2000);
        }

        return () => clearInterval(interval);
    }, [isOpen]);

    return (
        <Modal
            title={
                <div className="text-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                        Parabéns, Campeão! 🏆
                    </h2>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            onOk={handleReset}
            okText="Jogar Novamente!"
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{
                style: {
                    backgroundColor: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    width: '100%',
                },
                className: 'hover:opacity-70 hover:bg-amber-500',
                size: 'large',
            }}
            width={500}
            className="winner-modal"
            style={
                isMobile
                    ? {
                          top: '50%',
                          transform: 'translateY(-50%)',
                          maxHeight: '90vh',
                          overflow: 'auto',
                          width: '90%',
                      }
                    : undefined
            }
        >
            <div className="text-center py-2">
                <div className="space-y-6">
                    <div className="flex items-center justify-center">
                        <div className="bg-amber-500/20 p-4 rounded-full animate-bounce">
                            <FaTrophy className="w-12 h-12 text-amber-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl">
                            <div className="bg-amber-500/20 p-3 rounded-lg">
                                <FaClock className="w-8 h-8 text-amber-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-semibold">Tempo</p>
                                <p className="text-2xl font-bold text-amber-500">{getClock(timeToFinish)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl">
                            <div className="bg-amber-500/20 p-3 rounded-lg">
                                <FaCoins className="w-8 h-8 text-amber-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-semibold">Dinheiro Total</p>
                                <p className="text-2xl font-bold text-amber-500">
                                    {money.toLocaleString()} moedas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {(recordTime || isFirstTime) && (
                    <div className="mt-4 relative">
                        <div className="absolute -inset-1 bg-gradient-to-r bg-amber-400 rounded-xl blur opacity-30 animate-pulse"></div>
                        <div className="relative flex items-center gap-2 p-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-xl border border-amber-500/30">
                            <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-3 rounded-lg">
                                <FaTrophy className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-left flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-lg text-white font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text">
                                        Recorde
                                    </p>
                                    {(timeToFinish < Number(recordTime) || isFirstTime) && (
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-bold rounded-full animate-pulse">
                                            {isFirstTime ? 'Incrível! 🎉' : 'Novo! 🎉'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                                    {isFirstTime
                                        ? getClock(timeToFinish)
                                        : getClock(
                                              Number(recordTime) < Number(timeToFinish)
                                                  ? Number(recordTime)
                                                  : timeToFinish,
                                          )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                    Continue treinando para quebrar seu próprio recorde! 💪
                </div>
            </div>
        </Modal>
    );
}
