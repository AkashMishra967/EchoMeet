import React, { useEffect, useState } from 'react'
import "../App.css"
import "./landing.css"
import { Link, useNavigate } from 'react-router-dom'
import GuestJoinModal from './GuestJoinModal'

import VideocamIcon from '@mui/icons-material/Videocam'
import MicIcon from '@mui/icons-material/Mic'
import CallEndIcon from '@mui/icons-material/CallEnd'
import ChatIcon from '@mui/icons-material/Chat'
import ScreenShareIcon from '@mui/icons-material/ScreenShare'
import LinkIcon from '@mui/icons-material/Link'
import HdIcon from '@mui/icons-material/Hd'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import DevicesIcon from '@mui/icons-material/Devices'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const FEATURES = [
    {
        icon: <HdIcon />,
        title: "Crystal-clear video",
        text: "Smooth, low-latency video and audio powered by peer-to-peer WebRTC connections."
    },
    {
        icon: <TouchAppIcon />,
        title: "Click to focus",
        text: "Tap anyone's video to bring them full screen. Tap again to return to the grid."
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
    },
    {
        icon: <DevicesIcon />,
        title: "Works on every device",
        text: "Laptop, tablet or phone — EchoMeet adapts to your screen right in the browser."
    }
]

const STEPS = [
    { n: "01", title: "Sign in or join as guest", text: "Create an account in seconds, or jump straight in as a guest." },
    { n: "02", title: "Share your meeting link", text: "Enter a meeting code and send the link to anyone you want to talk to." },
    { n: "03", title: "Start talking", text: "Turn on your camera and mic, share your screen and chat live." }
]

const STATS = [
    { value: "HD", label: "Video quality" },
    { value: "1-click", label: "Join with a link" },
    { value: "0", label: "Downloads needed" },
    { value: "Free", label: "To get started" }
]

export default function LandingPage() {

    const router = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // "Join as Guest" popup (guest enters their own meeting code)
    const [guestOpen, setGuestOpen] = useState(false);
    const openGuest = () => { setMenuOpen(false); setGuestOpen(true); }

    // logged-in users see Dashboard / History / Logout instead of Login / Register
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
    const logout = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
        setMenuOpen(false);
    }

    // Navbar gets a glass background after the user scrolls a little
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Smooth scrolling only while the landing page is open
    useEffect(() => {
        const prev = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => { document.documentElement.style.scrollBehavior = prev; };
    }, []);

    const go = (path) => {
        setMenuOpen(false);
        router(path);
    }

    const scrollTo = (id) => {
        setMenuOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return (
        <div className='lp'>

            {/* ================= NAVBAR (fixed) ================= */}
            <header className={`lp-nav ${scrolled || menuOpen ? 'scrolled' : ''}`}>
                <div className='lp-nav-inner'>
                    <div className='lp-logo' onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                        <span className='lp-logo-icon'><VideocamIcon /></span>
                        <span className='lp-logo-text'>Echo<b>Meet</b></span>
                    </div>

                    {/* Desktop menu */}
                    <nav className='lp-nav-links'>
                        <button className='lp-link' onClick={() => scrollTo("features")}>Features</button>
                        <button className='lp-link' onClick={() => scrollTo("how")}>How it works</button>
                        <button className='lp-link' onClick={() => go("/about")}>About</button>
                        {loggedIn ? (
                            <>
                                <button className='lp-link' onClick={() => go("/history")}>History</button>
                                <span className='lp-nav-sep'></span>
                                <button className='lp-link' onClick={logout}>Logout</button>
                                <button className='lp-btn lp-btn-primary lp-btn-sm' onClick={() => go("/home")}>Dashboard</button>
                            </>
                        ) : (
                            <>
                                <button className='lp-link' onClick={() => openGuest()}>Join as Guest</button>
                                <span className='lp-nav-sep'></span>
                                <button className='lp-link' onClick={() => go("/auth")}>Register</button>
                                <button className='lp-btn lp-btn-primary lp-btn-sm' onClick={() => go("/auth")}>Login</button>
                            </>
                        )}
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
                        <button onClick={() => scrollTo("features")}>Features</button>
                        <button onClick={() => scrollTo("how")}>How it works</button>
                        <button onClick={() => go("/about")}>About</button>
                        {loggedIn ? (
                            <>
                                <button onClick={() => go("/history")}>History</button>
                                <button onClick={logout}>Logout</button>
                                <button className='lp-mobile-login' onClick={() => go("/home")}>Dashboard</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => openGuest()}>Join as Guest</button>
                                <button onClick={() => go("/auth")}>Register</button>
                                <button className='lp-mobile-login' onClick={() => go("/auth")}>Login</button>
                            </>
                        )}
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
                        Talk face to face, <span className='lp-accent'>from anywhere</span>
                    </h1>

                    <p className='lp-sub'>
                        High-quality video calls with screen sharing and live chat, right in
                        your browser. No downloads and no hassle &mdash; just share a link
                        and start talking.
                    </p>

                    <div className='lp-cta'>
                        <Link to={loggedIn ? "/home" : "/auth"} className='lp-btn lp-btn-primary lp-btn-lg'>
                            {loggedIn ? "Go to Dashboard" : "Get Started"} <ArrowForwardIcon />
                        </Link>
                        <button className='lp-btn lp-btn-ghost lp-btn-lg' onClick={() => openGuest()}>
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
                            <div className='lp-tile lp-tile-main'>
                                <div className='lp-avatar lp-avatar-lg'>
                                    <span className='lp-ring'></span>
                                    A
                                </div>
                                <span className='lp-name'><MicIcon /> Akash</span>
                            </div>

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

                    <div className='lp-chip lp-chip-1'><span className='lp-dot'></span> HD Quality</div>
                    <div className='lp-chip lp-chip-2'><LockOutlinedIcon /> Private &amp; secure</div>
                </div>
            </main>

            {/* ================= STATS ================= */}
            <section className='lp-stats'>
                {STATS.map((s) => (
                    <div className='lp-stat' key={s.label}>
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                    </div>
                ))}
            </section>

            {/* ================= FEATURES ================= */}
            <section className='lp-features' id='features'>
                <div className='lp-section-head'>
                    <span className='lp-eyebrow'>Features</span>
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

            {/* ================= HOW IT WORKS ================= */}
            <section className='lp-how' id='how'>
                <div className='lp-section-head'>
                    <span className='lp-eyebrow'>How it works</span>
                    <h2>Up and running in three steps</h2>
                    <p>From zero to your first call in under a minute.</p>
                </div>

                <div className='lp-steps'>
                    {STEPS.map((s) => (
                        <div className='lp-step' key={s.n}>
                            <span className='lp-step-n'>{s.n}</span>
                            <h3>{s.title}</h3>
                            <p>{s.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className='lp-final'>
                <h2>Ready to start your first call?</h2>
                <p>Create a free account or hop in as a guest &mdash; it takes less than a minute.</p>
                <div className='lp-cta lp-cta-center'>
                    <Link to={loggedIn ? "/home" : "/auth"} className='lp-btn lp-btn-white lp-btn-lg'>
                        {loggedIn ? "Go to Dashboard" : <>Get Started &mdash; it's free</>} <ArrowForwardIcon />
                    </Link>
                    <button className='lp-btn lp-btn-outline lp-btn-lg' onClick={() => openGuest()}>
                        Join as Guest
                    </button>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className='lp-footer'>
                <div className='lp-footer-inner'>
                    <div className='lp-logo'>
                        <span className='lp-logo-icon'><VideocamIcon /></span>
                        <span className='lp-logo-text'>Echo<b>Meet</b></span>
                    </div>
                    <div className='lp-footer-links'>
                        <button onClick={() => scrollTo("features")}>Features</button>
                        <button onClick={() => scrollTo("how")}>How it works</button>
                        <button onClick={() => go("/about")}>About</button>
                        <button onClick={() => openGuest()}>Join as Guest</button>
                        {loggedIn
                            ? <button onClick={() => go("/history")}>History</button>
                            : <button onClick={() => go("/auth")}>Login</button>}
                    </div>
                    <span className='lp-copy'>&copy; {new Date().getFullYear()} EchoMeet. All rights reserved.</span>
                </div>
            </footer>

            <GuestJoinModal open={guestOpen} onClose={() => setGuestOpen(false)} />
        </div>
    )
}