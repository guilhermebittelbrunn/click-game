'use client';

import { Avatar, Badge } from 'antd';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { BsCoin } from 'react-icons/bs';
import { getIcon } from './helpers/getIcons';
import { FaRegStar } from 'react-icons/fa6';
import Robot from './(components)/robot/robot';
import Image from 'next/image';
import boxingBag from './assets/boxing_bag.png';
import WelcomeModal from './(components)/welcomeModal/welcomeModal';
import WinnerModal from './(components)/winnerModal/winnerModal';

interface IUpgrade {
    price: number;
    level: number;
    name: string;
    basePrice: number;
    maxLevel?: number;
}

const defaultUpgrades: IUpgrade[] = [
    {
        price: 30,
        level: 1,
        name: 'Money',
        basePrice: 30,
    },
    {
        price: 50,
        level: 1,
        name: 'Cursor',
        basePrice: 50,
    },
    {
        price: 80,
        level: 0,
        name: 'Auto',
        basePrice: 80,
        maxLevel: 8,
    },
];

export default function Home() {
    const [score, setScore] = useState(0);
    const [money, setMoney] = useState(0);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [upgrades, setUpgrades] = useState<IUpgrade[]>(defaultUpgrades);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const target = useRef<HTMLDivElement>(null);

    const { cursorUpgrade, autoUpgrade, moneyUpgrade } = useMemo(() => {
        return {
            cursorUpgrade: upgrades.find((upgrade) => upgrade.name === 'Cursor'),
            autoUpgrade: upgrades.find((upgrade) => upgrade.name === 'Auto'),
            moneyUpgrade: upgrades.find((upgrade) => upgrade.name === 'Money'),
        };
    }, [upgrades]);

    const robots = useMemo(() => {
        return Array.from({ length: autoUpgrade?.level || 0 }, (_, index) => index);
    }, [autoUpgrade?.level]);

    const handleClick = useCallback(() => {
        const clickValue = cursorUpgrade?.level || 1;
        const moneyClickValue = moneyUpgrade?.level || 1;

        setScore((prev) => {
            const newScore = prev + clickValue;
            localStorage.setItem('score', newScore.toString());
            return newScore;
        });

        setMoney((prev) => {
            const newMoney = prev + moneyClickValue;
            localStorage.setItem('money', newMoney.toString());
            return newMoney;
        });

        localStorage.setItem('upgrades', JSON.stringify(upgrades));

        if (score === 1) {
            localStorage.setItem('dateStart', new Date().toISOString());
            localStorage.setItem('alreadyOpened', 'true');
        }

        if (score >= 500) {
            handleWinner();
        }
    }, [cursorUpgrade?.level, moneyUpgrade?.level, score, upgrades]);

    const handlePunch = useCallback(() => {
        target.current?.classList.add('punch-animation');
        handleClick();
        setTimeout(() => {
            target.current?.classList.remove('punch-animation');
        }, 200);
    }, [handleClick]);

    const handleRobotPunch = useCallback(() => {
        const clickValue = cursorUpgrade?.level || 1;
        const moneyClickValue = moneyUpgrade?.level || 1;

        setScore((prev) => {
            const newScore = prev + clickValue;
            localStorage.setItem('score', newScore.toString());
            return newScore;
        });

        setMoney((prev) => {
            const newMoney = prev + moneyClickValue;
            localStorage.setItem('money', newMoney.toString());
            return newMoney;
        });

        localStorage.setItem('upgrades', JSON.stringify(upgrades));

        if (score >= 500) {
            handleWinner();
        }
    }, [cursorUpgrade?.level, moneyUpgrade?.level, score, upgrades]);

    const handleWinner = () => {
        localStorage.setItem('dateEnd', new Date().toISOString());
        setShowWinnerModal(true);
    };

    const handleUpgrade = (upgrade: IUpgrade) => {
        if (upgrade.maxLevel && upgrade.level >= upgrade.maxLevel) {
            return;
        }

        if (money >= upgrade.price) {
            setMoney((prev) => prev - upgrade.price);
            setUpgrades((prev) => {
                const newUpgrades = prev.map((u) => {
                    if (u.name === upgrade.name) {
                        const newLevel = u.level + 1;
                        const newPrice = Math.floor(u.basePrice * Math.pow(1.5, newLevel - 1));
                        return { ...u, level: newLevel, price: newPrice };
                    }
                    return u;
                });
                return newUpgrades;
            });
            localStorage.setItem('money', money.toString());
            localStorage.setItem('upgrades', JSON.stringify(upgrades));
        }
    };

    useEffect(() => {
        const localScore = localStorage.getItem('score');
        const localMoney = localStorage.getItem('money');
        const localUpgrades = localStorage.getItem('upgrades');
        const alreadyOpened = localStorage.getItem('alreadyOpened');

        if (localScore) {
            setScore(Number(localScore));
        }
        if (localMoney) {
            setMoney(Number(localMoney));
        }
        if (localUpgrades) {
            setUpgrades(JSON.parse(localUpgrades));
        }

        setShowWelcomeModal(!alreadyOpened);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 flex flex-col items-center justify-center p-4">
            {showWelcomeModal && (
                <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
            )}
            {showWinnerModal && (
                <WinnerModal
                    isOpen={showWinnerModal}
                    onClose={() => setShowWinnerModal(false)}
                    score={score}
                    money={money}
                />
            )}
            <div className="text-center mb-2">
                <h2 className="text-4xl font-bold text-white mb-4">Punch Game</h2>
                <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-amber-400/30 shadow-lg">
                        <div className="bg-amber-400/20 p-2 rounded-lg">
                            <BsCoin className="w-7 h-7 text-amber-400" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-bold text-amber-200/80">Money</span>
                            <p className="text-2xl font-bold text-white">{money}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-400/30 shadow-lg">
                        <div className="bg-blue-400/20 p-2 rounded-lg">
                            <FaRegStar className="w-7 h-7 text-blue-400" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-bold text-blue-200/80">Score</span>
                            <p className="text-2xl font-bold text-white">{score}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative">
                <div ref={target} className="relative z-10">
                    <Image
                        src={boxingBag}
                        alt="boxing bag"
                        width={340}
                        className="hover:cursor-pointer transition-transform"
                        onClick={handlePunch}
                    />
                </div>
                {robots.length > 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
                        {robots.map((idx) => {
                            const angle = idx * (360 / robots.length) * (Math.PI / 180);
                            const radius = 180;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;

                            return (
                                <div
                                    key={`robot-${robots.length}-${idx}`}
                                    className="absolute"
                                    style={{
                                        left: `calc(50% + ${x}px)`,
                                        top: `calc(50% + ${y}px)`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <Robot onTick={handleRobotPunch} enabled={!showWinnerModal} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="mt-2 rounded-lg p-3 w-full max-w-lg">
                <div className="flex flex-row justify-center gap-6">
                    {upgrades.map((upgrade) => {
                        const isMaxLevel = upgrade.maxLevel && upgrade.level >= upgrade.maxLevel;
                        return (
                            <div
                                key={upgrade.name}
                                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg
                                     ${
                                         isMaxLevel
                                             ? 'bg-amber-600'
                                             : money >= upgrade.price
                                             ? 'bg-white/20 hover:bg-white/30'
                                             : 'bg-white/10 opacity-50'
                                     }
                                     transition-all duration-200 cursor-pointer min-w-[80px]`}
                                onClick={() => handleUpgrade(upgrade)}
                            >
                                <Badge count={!isMaxLevel ? upgrade.level : ''} size="default" className="mb-1">
                                    <Avatar
                                        shape="square"
                                        size={40}
                                        className="bg-amber-400/20"
                                        icon={
                                            <div className="w-6 h-6 text-amber-400 font-bold flex items-center justify-center">
                                                {getIcon(upgrade.name)}
                                            </div>
                                        }
                                    />
                                </Badge>
                                <h3 className="text-sm font-bold text-white mb-0.5">{upgrade.name}</h3>
                                {isMaxLevel ? (
                                    <p className="text-xs text-amber-400 font-bold">MAX</p>
                                ) : (
                                    <div className="flex items-center justify-center gap-1">
                                        <BsCoin className="w-3 h-3 text-amber-400" />
                                        <p className="text-xs text-amber-400 font-bold">{upgrade.price}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
