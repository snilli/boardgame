'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useAudioStore } from '@app/stores'
import { cn } from '@app/utils/cn'
import { SpeakerWaveIcon, XMarkIcon, MusicalNoteIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'

interface AudioSettingsProps {
	gameMode?: string
}

export default function AudioSettings({ gameMode }: AudioSettingsProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isDesktop, setIsDesktop] = useState(false)
	const { isPlaying, volume, isMuted, setVolume, toggleMute, play, pause } = useAudioStore()

	// ตรวจสอบขนาดหน้าจอ
	useEffect(() => {
		const checkScreenSize = () => {
			setIsDesktop(window.innerWidth >= 640)
		}

		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)
		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])

	// ปิด modal เมื่อเกม pause
	useEffect(() => {
		if (gameMode === 'paused') {
			setIsOpen(false)
		}
	}, [gameMode])

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseInt(e.target.value, 10)
		setVolume(newVolume)
	}

	return (
		<>
			{/* Volume Settings Button */}
			<motion.button
				onClick={() => setIsOpen(true)}
				className="group relative overflow-hidden rounded border border-white/20 bg-white/10 px-2 py-2 text-xs font-bold text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 sm:rounded-lg sm:px-3 sm:text-sm"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				title="Volume Settings"
			>
				<SpeakerWaveIcon className="h-4 w-4 sm:h-5 sm:w-5" />
			</motion.button>

			{/* Portal Modal to document.body */}
			{typeof document !== 'undefined' &&
				createPortal(
					<AnimatePresence>
						{isOpen && (
							<motion.div
								className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/70 sm:items-center sm:p-4"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => setIsOpen(false)}
							>
								<motion.div
									className="w-full max-w-md rounded-t-3xl border-t border-white/30 bg-gradient-to-b from-gray-800 to-gray-900 p-6 shadow-2xl backdrop-blur-lg sm:rounded-2xl sm:border"
									initial={{
										y: isDesktop ? 20 : '100%',
										scale: isDesktop ? 0.9 : 1,
										opacity: isDesktop ? 0 : 1,
									}}
									animate={{ y: 0, scale: 1, opacity: 1 }}
									exit={{
										y: isDesktop ? 20 : '100%',
										scale: isDesktop ? 0.9 : 1,
										opacity: isDesktop ? 0 : 1,
									}}
									transition={{ type: 'spring', damping: 30, stiffness: 300 }}
									onClick={(e) => e.stopPropagation()}
								>
									{/* Header */}
									<div className="mb-6 flex items-center justify-between">
										<h2 className="flex items-center gap-2 text-xl font-bold text-white">
											<MusicalNoteIcon className="h-6 w-6 text-blue-400" />
											Music Settings
										</h2>
										<motion.button
											onClick={() => setIsOpen(false)}
											className="rounded-xl p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
										>
											<XMarkIcon className="h-6 w-6" />
										</motion.button>
									</div>

									{/* Play/Pause Toggle */}
									<div className="mb-6">
										<div className="mb-3 flex items-center justify-between">
											<label className="flex items-center gap-3 text-lg font-bold text-white">
												<MusicalNoteIcon className="h-5 w-5" />
												Background Music
											</label>
											<motion.button
												onClick={isPlaying ? pause : play}
												className={cn(
													'relative h-7 w-12 rounded-full transition-colors duration-200',
													isPlaying ? 'bg-green-500' : 'bg-gray-600',
												)}
												whileTap={{ scale: 0.95 }}
											>
												<div
													className={cn(
														'absolute top-1 h-5 w-5 rounded-full bg-white transition-transform duration-200',
														isPlaying ? 'translate-x-6' : 'translate-x-1',
													)}
												/>
											</motion.button>
										</div>
										<p className="text-sm text-gray-400">
											{isPlaying
												? 'Music is playing - relaxing ambient tones'
												: 'Press to start relaxing music'}
										</p>
									</div>

									{/* Volume Controls */}
									<AnimatePresence>
										{isPlaying && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: 'auto' }}
												exit={{ opacity: 0, height: 0 }}
												transition={{ duration: 0.3 }}
												className="mb-6"
											>
												<div className="mb-4 flex items-center justify-between">
													<label className="flex items-center gap-2 text-lg font-bold text-white">
														{isMuted ? (
															<SpeakerXMarkIcon className="h-5 w-5 text-red-400" />
														) : (
															<SpeakerWaveIcon className="h-5 w-5 text-green-400" />
														)}
														Volume
													</label>
													<motion.button
														onClick={toggleMute}
														className={cn(
															'rounded-lg px-4 py-2 text-sm font-bold transition-colors',
															isMuted
																? 'bg-red-500/30 text-red-200 hover:bg-red-500/40'
																: 'bg-green-500/30 text-green-200 hover:bg-green-500/40',
														)}
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
													>
														{isMuted ? '🔇 Muted' : '🔊 On'}
													</motion.button>
												</div>

												{/* Volume Slider */}
												<div className="rounded-xl bg-gray-800/50 p-4">
													<input
														type="range"
														min="0"
														max="100"
														value={isMuted ? 0 : volume}
														onChange={handleVolumeChange}
														disabled={isMuted}
														className="h-3 w-full cursor-pointer appearance-none rounded-xl bg-gray-700 accent-blue-400 shadow-xl disabled:cursor-not-allowed disabled:accent-gray-500"
													/>

													<div className="mt-3 flex justify-between text-base font-bold text-white">
														<span className="text-gray-400">🔉 Quiet</span>
														<span className="rounded-lg border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-blue-200">
															{isMuted ? '🔇 0' : `🔊 ${volume}`}%
														</span>
														<span className="text-gray-400">🔊 Loud</span>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Info Tip */}
									<div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
										<p className="text-sm leading-relaxed text-blue-200">
											<strong>💡 Tip:</strong> Background music uses generated ambient tones.
											Perfect for focus and concentration while playing Sudoku!
										</p>
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</>
	)
}
