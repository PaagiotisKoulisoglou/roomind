import React, {useEffect, useRef, useState} from 'react'
import {useOutletContext} from "react-router";
import {CheckCircle2, ImageIcon, UploadIcon} from "lucide-react";
import {PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS} from "../lib/constants";

type UploadProps = {
    onComplete?: (base64: string) => void;
}

const Upload: React.FC<UploadProps> = ({ onComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const {isSignedIn} = useOutletContext<AuthContext>();

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    const startProgress = (base64Data: string) => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setProgress(0);
        intervalRef.current = window.setInterval(() => {
            setProgress(prev => {
                const next = Math.min(100, prev + PROGRESS_STEP);
                if (next === 100) {
                    if (intervalRef.current !== null) {
                        window.clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    // After reaching 100%, wait and then call onComplete
                    setTimeout(() => {
                        if (onComplete) onComplete(base64Data);
                    }, REDIRECT_DELAY_MS);
                }
                return next;
            });
        }, PROGRESS_INTERVAL_MS);
    };

    const processFile = (f: File) => {
        if (!isSignedIn) return; // Block all logic when not signed in
        setFile(f);
        setProgress(0);

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string; // full data URL (e.g. data:image/png;base64,...)
            startProgress(result);
        };
        reader.onerror = () => {
            // Reset state on error
            setFile(null);
            setProgress(0);
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
        reader.readAsDataURL(f);
    };

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!isSignedIn) return; // Block when not signed in
        const f = e.target.files && e.target.files[0];
        if (f) {
            processFile(f);
        }
    };

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (!isSignedIn) return; // Block when not signed in
        const f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) {
            processFile(f);
        }
    };

    return (
        <div className="upload">
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file" className="drop-input" accept=".jpg,.jpeg,.png" disabled={!isSignedIn}
                        onChange={handleInputChange}
                    />
                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20} />
                        </div>
                        <p>
                            {isSignedIn ? (
                                "Click to upload or just drag and drop"
                            ) : ("Sign in or sign up with puter to upload")}
                        </p>
                        <p className="help">Maximum file size 50 MB.</p>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="upload-status">
                        <div className="status-content">
                            <div className="status-icon">
                                {progress === 100 ? (
                                    <CheckCircle2 className="check" />
                                ) : (
                                    <ImageIcon className="image" />
                                )}
                            </div>

                            <h3>{file.name}</h3>

                            <div className="progress">
                                <div className="bar" style={{ width: `${progress}%`}}/>

                                <p className="status-text">
                                    {progress < 100 ? `Analyzing Floor Plan...` : `Redirecting...`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
export default Upload
