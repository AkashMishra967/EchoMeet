import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import "./guest.css"

import CloseIcon from '@mui/icons-material/Close'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

// words that are real pages of the app, so they can't be used as a meeting code
export const RESERVED_CODES = ["auth", "home", "history"];

// random readable meeting code like "kqz-mdvr-twa"
export const generateCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const part = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `${part(3)}-${part(4)}-${part(3)}`;
}

// Popup used by "Join as Guest" (landing page + login page)
export default function GuestJoinModal({ open, onClose }) {

    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    // close on Esc, lock page scroll while open
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    const go = (value) => {
        const clean = (value || "").trim();
        if (!clean) { setError("Please enter a meeting code."); return; }
        if (RESERVED_CODES.includes(clean.toLowerCase())) {
            setError("That code is reserved. Please choose a different one.");
            return;
        }
        onClose();
        navigate(`/${encodeURIComponent(clean)}`);
    }

    return createPortal(
        <div className='gp-overlay' onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className='gp-card' role="dialog" aria-modal="true" aria-label="Join as guest">
                <button className='gp-close' onClick={onClose} aria-label="Close"><CloseIcon /></button>

                <span className='gp-icon'><PersonOutlineIcon /></span>
                <h2>Join as <span className='gp-accent'>Guest</span></h2>
                <p className='gp-sub'>Enter the meeting code you received, or start a new private meeting.</p>

                <form onSubmit={(e) => { e.preventDefault(); go(code); }}>
                    <div className='gp-input'>
                        <KeyboardIcon />
                        <input
                            type="text"
                            placeholder="Enter meeting code"
                            value={code}
                            onChange={(e) => { setCode(e.target.value); setError(""); }}
                            autoFocus
                            aria-label="Meeting code"
                        />
                    </div>
                    {error && <p className='gp-error' role="alert">{error}</p>}

                    <button type="submit" className='gp-btn gp-primary' disabled={!code.trim()}>
                        Join meeting <ArrowForwardIcon />
                    </button>
                </form>

                <div className='gp-or'><span>or</span></div>

                <button className='gp-btn gp-ghost' onClick={() => go(generateCode())}>
                    <AddIcon /> Start a new meeting
                </button>
            </div>
        </div>,
        document.body
    )
}