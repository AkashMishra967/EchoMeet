import React, { useSyncExternalStore } from 'react'
import { subscribe, getSlow } from '../utils/loadingBus'
import "./loader.css"

import VideocamIcon from '@mui/icons-material/Videocam'

// Spinning logo loader (reusable)
export function SpinnerLogo({ size = 84 }) {
    return (
        <div className='sl-spinner' style={{ width: size, height: size }}>
            <span className='sl-ring'></span>
            <span className='sl-ring sl-ring-2'></span>
            <span className='sl-logo'><VideocamIcon /></span>
        </div>
    )
}

// Full-screen overlay – shows automatically while the server is slow to answer
export default function ServerLoader() {
    const slow = useSyncExternalStore(subscribe, getSlow, getSlow);

    if (!slow) return null;

    return (
        <div className='sl-overlay' role="status" aria-live="polite">
            <div className='sl-card'>
                <SpinnerLogo />
                <h3>Starting the server<span className='sl-dots'><i>.</i><i>.</i><i>.</i></span></h3>
                <p>
                    The server was sleeping to save resources. This can take up to a
                    minute the first time &mdash; please don't close this page.
                </p>
                <div className='sl-bar'><span></span></div>
            </div>
        </div>
    )
}