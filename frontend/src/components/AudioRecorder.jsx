import React, { useState, useRef, useEffect } from "react";

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [volume, setVolume] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const animationRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const timerRef = useRef(null);

    // Initialize audio context and analyzer
    const initAudioAnalyzer = async (stream) => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 32;
    };

    // Start Recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            await initAudioAnalyzer(stream);
            
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
                const audioURL = URL.createObjectURL(audioBlob);
                setAudioURL(audioURL);
                audioChunks.current = [];
                cancelAnimationFrame(animationRef.current);
                clearInterval(timerRef.current);
                setRecordingTime(0);
                setVolume(0);
            };

            mediaRecorderRef.current.start();
            setRecording(true);
            
            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            
            // Start volume visualization
            visualizeVolume();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    // Visualize volume
    const visualizeVolume = () => {
        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            setVolume(average);
            animationRef.current = requestAnimationFrame(updateVolume);
        };
        
        animationRef.current = requestAnimationFrame(updateVolume);
    };

    // Stop Recording
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    // Format time (seconds to MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Clean up
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
            }
            cancelAnimationFrame(animationRef.current);
            clearInterval(timerRef.current);
        };
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Audio Recorder</h2>
                <p style={styles.subtitle}>Record and play back your voice</p>
                
                {/* Visualizer */}
                <div style={styles.visualizerContainer}>
                    {recording ? (
                        <div style={styles.visualizer}>
                            {[...Array(20)].map((_, i) => (
                                <div 
                                    key={i}
                                    style={{
                                        ...styles.visualizerBar,
                                        height: `${volume * 0.2 + (i % 3) * 5}%`,
                                        animationDelay: `${i * 0.05}s`,
                                        backgroundColor: `hsl(${volume * 0.5 + 200}, 80%, 50%)`,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={styles.placeholderVisualizer}>
                            <div style={styles.micIcon}>🎤</div>
                            <p>Press record to start</p>
                        </div>
                    )}
                </div>
                
                {/* Timer */}
                {recording && (
                    <div style={styles.timer}>
                        <div style={styles.timerCircle}>
                            <span>{formatTime(recordingTime)}</span>
                        </div>
                    </div>
                )}
                
                {/* Buttons */}
                <div style={styles.buttonContainer}>
                    <button 
                        style={{
                            ...styles.button,
                            ...styles.startButton,
                            transform: recording ? 'scale(0.95)' : 'scale(1)',
                            opacity: recording ? 0.7 : 1,
                        }} 
                        onClick={startRecording} 
                        disabled={recording}
                    >
                        {recording ? 'Recording...' : 'Start Recording'}
                    </button>
                    
                    <button 
                        style={{
                            ...styles.button,
                            ...styles.stopButton,
                            transform: !recording ? 'scale(0.95)' : 'scale(1)',
                            opacity: !recording ? 0.7 : 1,
                            visibility: recording ? 'visible' : 'hidden',
                        }} 
                        onClick={stopRecording} 
                        disabled={!recording}
                    >
                        Stop
                    </button>
                </div>
                
                {/* Audio Player */}
                {audioURL && (
                    <div style={styles.audioPlayer}>
                        <h3 style={styles.audioTitle}>Your Recording</h3>
                        <audio 
                            controls 
                            style={styles.audioElement}
                            onPlay={() => setAudioPlaying(true)}
                            onPause={() => setAudioPlaying(false)}
                        >
                            <source src={audioURL} type="audio/wav" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        fontFamily: '"Segoe UI", Roboto, sans-serif',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
    },
    title: {
        color: '#2c3e50',
        marginBottom: '0.5rem',
        fontSize: '1.8rem',
        fontWeight: '600',
    },
    subtitle: {
        color: '#7f8c8d',
        marginBottom: '2rem',
        fontSize: '1rem',
    },
    visualizerContainer: {
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    visualizer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '100%',
        width: '100%',
        gap: '4px',
    },
    visualizerBar: {
        width: '8px',
        backgroundColor: '#3498db',
        borderRadius: '4px',
        transition: 'height 0.1s ease',
        animation: 'pulse 1.5s ease-in-out infinite alternate',
    },
    placeholderVisualizer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#bdc3c7',
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
    },
    micIcon: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    timer: {
        marginBottom: '1.5rem',
    },
    timerCircle: {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#e74c3c',
        color: 'white',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        boxShadow: '0 0 20px rgba(231, 76, 60, 0.3)',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    button: {
        padding: '0.8rem 1.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minWidth: '160px',
    },
    startButton: {
        backgroundColor: '#2ecc71',
        color: 'white',
        boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)',
    },
    stopButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
    },
    audioPlayer: {
        marginTop: '1.5rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        textAlign: 'center',
    },
    audioTitle: {
        color: '#2c3e50',
        marginBottom: '1rem',
        fontSize: '1.2rem',
    },
    audioElement: {
        width: '100%',
        borderRadius: '8px',
    },
    '@keyframes pulse': {
        '0%': { opacity: 0.6 },
        '100%': { opacity: 1 },
    },
};

export default AudioRecorder;