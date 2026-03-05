'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface LessonPlayerProps {
    src: string;
    poster?: string;
    onComplete?: () => void;
}

function formatDuration(seconds: number): string {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function LessonPlayer({ src, poster, onComplete }: LessonPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetHideTimer = useCallback(() => {
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        setShowControls(true);
        hideControlsTimer.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    }, [isPlaying]);

    useEffect(() => {
        return () => {
            if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        };
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleVolumeChange = (val: number[]) => {
        const video = videoRef.current;
        if (!video) return;
        const v = val[0] / 100;
        video.volume = v;
        video.muted = v === 0;
        setVolume(v);
        setIsMuted(v === 0);
    };

    const handleSeek = (val: number[]) => {
        const video = videoRef.current;
        if (!video || !duration) return;
        video.currentTime = (val[0] / 100) * duration;
    };

    const handleRestart = () => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        video.play();
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;
        if (!document.fullscreenElement) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div
            ref={containerRef}
            className="relative aspect-video w-full overflow-hidden rounded-xl bg-black group"
            onMouseMove={resetHideTimer}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Real HTML5 Video */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="h-full w-full object-contain"
                playsInline
                onPlay={() => { setIsPlaying(true); resetHideTimer(); }}
                onPause={() => { setIsPlaying(false); setShowControls(true); }}
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
                onEnded={() => {
                    setIsPlaying(false);
                    setShowControls(true);
                    onComplete?.();
                }}
                onVolumeChange={() => {
                    const v = videoRef.current;
                    if (v) { setIsMuted(v.muted); setVolume(v.muted ? 0 : v.volume); }
                }}
            />

            {/* Centre Play / Replay Overlay */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={togglePlay}
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                        {currentTime > 0 && currentTime >= duration && duration > 0 ? (
                            <RotateCcw className="h-8 w-8 text-white" />
                        ) : (
                            <Play className="h-8 w-8 fill-white text-white ml-1" />
                        )}
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Seek Bar */}
                <div className="mb-3">
                    <Slider
                        value={[progressPercent]}
                        max={100}
                        step={0.1}
                        className="cursor-pointer [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                        onValueChange={handleSeek}
                    />
                </div>

                <div className="flex items-center justify-between text-white">
                    {/* Left Controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={togglePlay}
                            className="hover:text-[#7bbcbc] transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </button>

                        <button
                            onClick={handleRestart}
                            className="hover:text-[#7bbcbc] transition-colors"
                            aria-label="Restart"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-2 group/vol">
                            <button
                                onClick={toggleMute}
                                className="hover:text-[#7bbcbc] transition-colors"
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </button>
                            <div className="hidden sm:block w-20">
                                <Slider
                                    value={[isMuted ? 0 : volume * 100]}
                                    max={100}
                                    step={1}
                                    className="cursor-pointer [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                                    onValueChange={handleVolumeChange}
                                />
                            </div>
                        </div>

                        <span className="text-xs font-medium tabular-nums whitespace-nowrap">
                            {formatDuration(currentTime)} / {formatDuration(duration)}
                        </span>
                    </div>

                    {/* Right Controls */}
                    <button
                        onClick={toggleFullscreen}
                        className="hover:text-[#7bbcbc] transition-colors"
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
