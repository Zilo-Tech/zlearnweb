'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface LessonPlayerProps {
    src: string;
    poster?: string;
    onComplete?: () => void;
}

export function LessonPlayer({ src, poster, onComplete }: LessonPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    // Mock video controls for now
    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black group">
            {/* Video Element Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
                {!isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Button
                            size="icon"
                            className="h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                            onClick={togglePlay}
                        >
                            <Play className="h-8 w-8 fill-white text-white ml-1" />
                        </Button>
                    </div>
                )}
                <img
                    src={poster || "/images/video-placeholder.jpg"}
                    alt="Video poster"
                    className="h-full w-full object-cover opacity-50"
                />
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                {/* Progress Bar */}
                <div className="mb-4">
                    <Slider
                        value={[progress]}
                        max={100}
                        step={1}
                        className="cursor-pointer"
                        onValueChange={(val) => setProgress(val[0])}
                    />
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="hover:text-[#446D6D] transition-colors">
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </button>

                        <div className="flex items-center gap-2 group/volume">
                            <button onClick={toggleMute} className="hover:text-[#446D6D] transition-colors">
                                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                            </button>
                            <div className="w-0 overflow-hidden transition-all group-hover/volume:w-24">
                                <Slider defaultValue={[100]} max={100} step={1} className="w-24" />
                            </div>
                        </div>

                        <span className="text-sm font-medium">02:30 / 15:00</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hover:text-[#446D6D] transition-colors">
                            <Settings className="h-5 w-5" />
                        </button>
                        <button className="hover:text-[#446D6D] transition-colors">
                            <Maximize className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
