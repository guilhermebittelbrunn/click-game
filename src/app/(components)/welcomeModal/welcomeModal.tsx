'use client';

import { Modal } from 'antd';
import { FaRobot, FaCoins } from 'react-icons/fa';
import { BsArrowUpCircle } from 'react-icons/bs';
import { GiPunch } from 'react-icons/gi';
import { useEffect, useState } from 'react';

interface IWelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: IWelcomeModalProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return (
        <Modal
            title={
                <div className="text-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Bem vindo ao Punch Game!
                    </h2>
                </div>
            }
            open={isOpen}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { display: 'none' } }}
            width={500}
            className="welcome-modal"
            onCancel={onClose}
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
            <div className="text-center py-4">
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl">
                        <div className="bg-purple-500/20 p-3 rounded-lg">
                            <GiPunch className="w-8 h-8 text-purple-500" />
                        </div>
                        <p className="text-left text-lg">Clique na bolsa de boxe para ganhar pontos</p>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                            <FaCoins className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-left text-lg">Use seus pontos para comprar upgrades</p>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl">
                        <div className="bg-purple-500/20 p-3 rounded-lg">
                            <BsArrowUpCircle className="w-8 h-8 text-purple-500" />
                        </div>
                        <p className="text-left text-lg">Cada upgrade aumenta seus ganhos</p>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                            <FaRobot className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-left text-lg">Desbloqueie robôs para ganhos automáticos!</p>
                    </div>
                </div>

                <div className="mt-8 text-sm text-gray-500">Divirta-se e quebre recordes! 🎮</div>
            </div>
        </Modal>
    );
}
