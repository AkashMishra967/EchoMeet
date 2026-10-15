import React, { useState } from 'react'
import "../App.css"
import "./landing.css"
import { Link, useNavigate } from 'react-router-dom'

import VideocamIcon from '@mui/icons-material/Videocam'
import MicIcon from '@mui/icons-material/Mic'
import CallEndIcon from '@mui/icons-material/CallEnd'
import ChatIcon from '@mui/icons-material/Chat'
import ScreenShareIcon from '@mui/icons-material/ScreenShare'
import LinkIcon from '@mui/icons-material/Link'
import HdIcon from '@mui/icons-material/Hd'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const FEATURES = [
    {
        icon: <HdIcon />,
        title: "Crystal-clear video",
        text: "Smooth, low-latency video and audio powered by peer-to-peer WebRTC connections."
    },
    {
        icon: <ScreenShareIcon />,
        title: "Screen sharing",
        text: "Present your screen to everyone in the room with a single click."
    },
    {
        icon: <ChatIcon />,
        title: "Live chat",
        text: "Send messages during the call without ever leaving the meeting."
    },
    {
        icon: <LinkIcon />,
        title: "Join with a link",
        text: "No downloads, no installs. Share a meeting link and start talking instantly."
    }
]

export default function LandingPage() {

    const router = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const go = (path) => {
        setMenuOpen(false);
        router(path);
    }

    return (
        <div className='lp'>

            {/* ================= NAVBAR ================= */}
            <header className='lp-nav'>
                <div className='lp-nav-inner'>
                    <div className='lp-logo' onClick={() => go("/")}>
                        <span className='lp-logo-icon'><VideocamIcon /></span>
                        <span className='lp-logo-text'>Echo<b>Meet</b></span>
                    </div>

                    {/* Desktop menu */}
                    <nav className='lp-nav-links'>
                        <button className='lp-link' onClick={() => go("/aljk23")}>Join as Guest</button>
                        <button className='lp-link' onClick={() => go("/auth")}>Register</button>
                        <button className='lp-btn lp-btn-primary lp-btn-sm' onClick={() => go("/auth")}>Login</button>
                    </nav>

                    {/* Hamburger (mobile) */}
                    <button
                        className={`lp-burger ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span><span></span><span></span>
                    </button>
                </div>

                {/* Mobile dropdown */}
                {menuOpen && (
                    <div className='lp-mobile-menu'>
                        <button onClick={() => go("/aljk23")}>Join as Guest</button>
                        <button onClick={() => go("/auth")}>Register</button>
                        <button className='lp-mobile-login' onClick={() => go("/auth")}>Login</button>
                    </div>
                )}
            </header>

            {/* ================= HERO ================= */}
            <main className='lp-hero'>
                <div className='lp-hero-text'>
                    <span className='lp-badge'>
                        <span className='lp-dot'></span> Free &amp; secure video meetings
                    </span>

                    <h1>
                        Video calls that bring <span className='lp-accent'>you closer</span>
                    </h1>

                    <p className='lp-sub'>
                        Connect with friends, family and teams in HD. No downloads,
                        no sign-up hassle &mdash; just share a link and start talking.
                    </p>

                    <div className='lp-cta'>
                        <Link to="/auth" className='lp-btn lp-btn-primary lp-btn-lg'>Get Started</Link>
                        <button className='lp-btn lp-btn-ghost lp-btn-lg' onClick={() => go("/aljk23")}>
                            Join as Guest
                        </button>
                    </div>

                    <ul className='lp-checks'>
                        <li><CheckCircleIcon /> No installation</li>
                        <li><CheckCircleIcon /> Screen sharing</li>
                        <li><CheckCircleIcon /> Live chat</li>
                    </ul>
                </div>

                {/* ---------- Product mockup ---------- */}
                <div className='lp-hero-visual' aria-hidden="true">
                    <div className='lp-glow'></div>

                    <div className='lp-window'>
                        <div className='lp-window-bar'>
                            <i></i><i></i><i></i>
                            <span className='lp-window-url'><LockOutlinedIcon /> echomeet.app/team-sync</span>
                        </div>

                        <div className='lp-stage'>
                            {/* Focused (big) tile */}
                            <div className='lp-tile lp-tile-main'>
                                <div className='lp-avatar lp-avatar-lg'>
                                    <span className='lp-ring'></span>
                                    A
                                </div>
                                <span className='lp-name'><MicIcon /> Akash</span>
                            </div>

                            {/* Thumbnails */}
                            <div className='lp-thumbs'>
                                <div className='lp-tile lp-tile-thumb t1'>
                                    <div className='lp-avatar'>R</div>
                                    <span className='lp-name'>Riya</span>
                                </div>
                                <div className='lp-tile lp-tile-thumb t2'>
                                    <div className='lp-avatar'>S</div>
                                    <span className='lp-name'>Sam</span>
                                </div>
                                <div className='lp-tile lp-tile-thumb t3'>
                                    <div className='lp-avatar'>Y</div>
                                    <span className='lp-name'>You</span>
                                </div>
                            </div>
                        </div>

                        <div className='lp-controls'>
                            <span className='lp-ctrl'><VideocamIcon /></span>
                            <span className='lp-ctrl'><MicIcon /></span>
                            <span className='lp-ctrl lp-ctrl-end'><CallEndIcon /></span>
                            <span className='lp-ctrl'><ScreenShareIcon /></span>
                            <span className='lp-ctrl'><ChatIcon /></span>
                        </div>
                    </div>

                    {/* Floating chips */}
                    <div className='lp-chip lp-chip-1'><span className='lp-dot'></span> HD Quality</div>
                    <div className='lp-chip lp-chip-2'><LockOutlinedIcon /> Private &amp; secure</div>
                </div>
            </main>

            {/* ================= FEATURES ================= */}
            <section className='lp-features'>
                <div className='lp-section-head'>
                    <h2>Everything you need for a great call</h2>
                    <p>Simple, fast and reliable &mdash; built so you can focus on the conversation.</p>
                </div>

                <div className='lp-grid'>
                    {FEATURES.map((f) => (
                        <div className='lp-card' key={f.title}>
                            <div className='lp-card-icon'>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className='lp-final'>
                <h2>Ready to start your first call?</h2>
                <p>It takes less than a minute to get going.</p>
                <Link to="/auth" className='lp-btn lp-btn-primary lp-btn-lg'>Get Started &mdash; it's free</Link>
            </section>

            <footer className='lp-footer'>
                &copy; {new Date().getFullYear()} EchoMeet. All rights reserved.
            </footer>
        </div>
    )
}