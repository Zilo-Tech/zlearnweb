'use client';

import { useEffect, useState } from 'react';
import { Trophy, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    newLevel: number;
    rewards?: string[];
}

export function LevelUpModal({ isOpen, onClose, newLevel, rewards = [] }: LevelUpModalProps) {
    useEffect(() => {
        if (isOpen) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            const random = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md text-center border-none bg-gradient-to-b from-[#446D6D] to-[#2A4A4A] text-white p-0 overflow-hidden">
                <div className="relative p-8 pt-12">
                    <div className="absolute top-4 right-4">
                        <button onClick={onClose} className="text-white/60 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/20 backdrop-blur-sm">
                        <Trophy className="h-12 w-12 text-yellow-400 drop-shadow-lg" />
                    </div>

                    <DialogTitle className="text-3xl font-bold text-white mb-2">Level Up!</DialogTitle>
                    <p className="text-white/80 text-lg mb-8">
                        Congratulations! You've reached <span className="font-bold text-yellow-400">Level {newLevel}</span>
                    </p>

                    {rewards.length > 0 && (
                        <div className="mb-8 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                            <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/60">Rewards Unlocked</h4>
                            <ul className="space-y-2">
                                {rewards.map((reward, i) => (
                                    <li key={i} className="flex items-center justify-center gap-2 text-white">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        {reward}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Button
                        size="lg"
                        className="w-full bg-white text-[#446D6D] hover:bg-white/90 font-bold"
                        onClick={onClose}
                    >
                        Awesome!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
