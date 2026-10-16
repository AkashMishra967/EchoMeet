import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./about.css"

import VideocamIcon from '@mui/icons-material/Videocam'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CodeIcon from '@mui/icons-material/Code'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import HdIcon from '@mui/icons-material/Hd'
import MicIcon from '@mui/icons-material/Mic'
import ScreenShareIcon from '@mui/icons-material/ScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import LinkIcon from '@mui/icons-material/Link'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import HistoryIcon from '@mui/icons-material/History'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

/* ==========================================================
   EDIT YOUR DETAILS HERE – the whole page is built from this.
   Leave a link as "" and its button is hidden automatically.
   ========================================================== */
const DEV = {
    name: "Akash Mishra",
    role: "Full Stack Developer",
    location: "",                                  // e.g. "Lucknow, India"
    photo: "profile.jpg",                          // put your photo in frontend/public/profile.jpg
    status: "Creator of EchoMeet",                 // small green badge on the photo ("" hides it)
    intro: "I build fast, real-time web applications and love turning ideas into products people actually use.",
    bio: [
        "Hi, I'm Akash Mishra, a developer who enjoys building complete products from the first line of code to the live deployment.",
        "EchoMeet is a video meeting platform I designed and built from scratch. It started as a way to understand how real-time communication works, and grew into a full application with authentication, meeting history, screen sharing and live chat.",
    ],
    github: "https://github.com/AkashMishra967",
    repo: "https://github.com/AkashMishra967/EchoMeet",
    linkedin: "",                                  // e.g. "https://www.linkedin.com/in/your-name"
    email: "",                                     // e.g. "you@example.com"
    resume: "",                                    // e.g. "/resume.pdf" (put the file in frontend/public)
}

const STATS = [
    { value: "Real-time", label: "WebRTC + Socket.IO" },
    { value: "Multi-user", label: "Rooms with many people" },
    { value: "Full stack", label: "Frontend to deployment" },
    { value: "Responsive", label: "Mobile & desktop" },
]

const FEATURES = [
    { icon: <HdIcon />, title: "Real-time video calls", text: "Low-latency, peer-to-peer video between participants." },
    { icon: <MicIcon />, title: "Audio & camera controls", text: "Mute, unmute and switch your camera on or off anytime." },
    { icon: <ScreenShareIcon />, title: "Screen sharing", text: "Present your screen to everyone in the meeting." },
    { icon: <ChatIcon />, title: "Live chat", text: "Message the room during the call with unread notifications." },
    { icon: <LinkIcon />, title: "Shareable meeting links", text: "Every meeting has a unique code and link anyone can join." },
    { icon: <LockOutlinedIcon />, title: "Secure authentication", text: "Register and log in with hashed passwords and token-based sessions." },
    { icon: <HistoryIcon />, title: "Meeting history", text: "See and rejoin every meeting you have attended." },
    { icon: <TouchAppIcon />, title: "Click to focus", text: "Tap any participant to bring them full screen." },
]

const STACK = [
    { group: "Frontend", items: ["React 19", "React Router", "Material UI", "Axios", "CSS3"] },
    { group: "Real-time", items: ["WebRTC", "Socket.IO"] },
    { group: "Backend", items: ["Node.js", "Express", "MongoDB", "Mongoose", "bcrypt"] },
    { group: "Tools & Hosting", items: ["Git & GitHub", "Render", "VS Code"] },
]

const STEPS = [
    { n: "01", title: "Join a room", text: "A meeting code in the URL decides which room you enter. Anyone with the same code lands in the same room." },
    { n: "02", title: "Signaling with Socket.IO", text: "The server only introduces browsers to each other, passing the WebRTC offers, answers and ICE candidates." },
    { n: "03", title: "Peer-to-peer media", text: "Video and audio then flow directly between browsers over WebRTC, keeping calls fast and private." },
]

const LEARNED = [
    "Managing multiple WebRTC peer connections in one room",
    "Designing a responsive video layout for phones and laptops",
    "Building token-based authentication with hashed passwords",
    "Deploying a full-stack app and handling free-tier cold starts",
]

export default function About() {

    const navigate = useNavigate();
    const [photoFailed, setPhotoFailed] = useState(false);

    const loggedIn = !!localStorage.getItem("token");
    const initials = DEV.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    const photoSrc = `${process.env.PUBLIC_URL}/${DEV.photo}`;

    return (
        <div className='ab'>

            {/* ---------------- NAV ---------------- */}
            <header className='ab-nav'>
                <div className='ab-nav-inner'>
                    <div className='ab-logo' onClick={() => navigate("/")}>
                        <span className='ab-logo-icon'><VideocamIcon /></span>
                        <span className='ab-logo-text'>Echo<b>Meet</b></span>
                    </div>
                    <div className='ab-nav-actions'>
                        <button className='ab-link' onClick={() => navigate("/")}>
                            <ArrowBackIcon /> <span>Home</span>
                        </button>
                        <button className='ab-btn ab-btn-primary ab-btn-sm' onClick={() => navigate(loggedIn ? "/home" : "/auth")}>
                            {loggedIn ? "Dashboard" : "Get Started"}
                        </button>
                    </div>
                </div>
            </header>

            {/* ---------------- HERO ---------------- */}
            <section className='ab-hero'>
                <div className='ab-hero-text'>
                    <span className='ab-badge'><CodeIcon /> About the developer</span>

                    <h1>Hi, I'm <span className='ab-accent'>{DEV.name}</span></h1>
                    <h2>{DEV.role}</h2>
                    {DEV.location && <p className='ab-loc'><PlaceOutlinedIcon /> {DEV.location}</p>}

                    <p className='ab-intro'>{DEV.intro}</p>

                    <div className='ab-cta'>
                        {DEV.github && (
                            <a className='ab-btn ab-btn-dark' href={DEV.github} target="_blank" rel="noopener noreferrer">
                                <GitHubIcon /> GitHub
                            </a>
                        )}
                        {DEV.linkedin && (
                            <a className='ab-btn ab-btn-ghost' href={DEV.linkedin} target="_blank" rel="noopener noreferrer">
                                <LinkedInIcon /> LinkedIn
                            </a>
                        )}
                        {DEV.email && (
                            <a className='ab-btn ab-btn-ghost' href={`mailto:${DEV.email}`}>
                                <EmailOutlinedIcon /> Email me
                            </a>
                        )}
                        {DEV.resume && (
                            <a className='ab-btn ab-btn-ghost' href={DEV.resume} target="_blank" rel="noopener noreferrer">
                                <DescriptionOutlinedIcon /> Resume
                            </a>
                        )}
                    </div>
                </div>

                <div className='ab-photo-wrap'>
                    <div className='ab-glow'></div>
                    <div className='ab-photo'>
                        {!photoFailed ? (
                            <img
                                src={photoSrc}
                                alt={DEV.name}
                                onError={() => setPhotoFailed(true)}
                            />
                        ) : (
                            <div className='ab-initials'>{initials}</div>
                        )}
                    </div>
                    <div className='ab-chip ab-chip-1'><CodeIcon /> {DEV.role}</div>
                    {DEV.status && <div className='ab-chip ab-chip-2'><span className='ab-dot'></span> {DEV.status}</div>}
                </div>
            </section>

            {/* ---------------- STATS ---------------- */}
            <section className='ab-stats'>
                {STATS.map((s) => (
                    <div className='ab-stat' key={s.value}>
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                    </div>
                ))}
            </section>

            {/* ---------------- BIO ---------------- */}
            <section className='ab-section ab-bio'>
                <div className='ab-section-head'>
                    <span className='ab-eyebrow'>My story</span>
                    <h3>The person behind EchoMeet</h3>
                </div>
                <div className='ab-bio-card'>
                    {DEV.bio.map((p, i) => <p key={i}>{p}</p>)}
                </div>
            </section>

            {/* ---------------- ABOUT PROJECT ---------------- */}
            <section className='ab-section'>
                <div className='ab-section-head'>
                    <span className='ab-eyebrow'>The project</span>
                    <h3>What is EchoMeet?</h3>
                    <p>
                        EchoMeet is a full-stack video conferencing web app inspired by Zoom. Create or
                        join meeting rooms, talk face to face, share your screen and chat live, all from the browser.
                    </p>
                </div>

                <div className='ab-grid'>
                    {FEATURES.map((f) => (
                        <div className='ab-card' key={f.title}>
                            <div className='ab-card-icon'>{f.icon}</div>
                            <h4>{f.title}</h4>
                            <p>{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------------- HOW IT WORKS ---------------- */}
            <section className='ab-section'>
                <div className='ab-section-head'>
                    <span className='ab-eyebrow'>Under the hood</span>
                    <h3>How a call works</h3>
                </div>
                <div className='ab-steps'>
                    {STEPS.map((s) => (
                        <div className='ab-step' key={s.n}>
                            <span className='ab-step-n'>{s.n}</span>
                            <h4>{s.title}</h4>
                            <p>{s.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------------- TECH STACK ---------------- */}
            <section className='ab-section'>
                <div className='ab-section-head'>
                    <span className='ab-eyebrow'>Tech stack</span>
                    <h3>Built with</h3>
                </div>
                <div className='ab-stack'>
                    {STACK.map((g) => (
                        <div className='ab-stack-group' key={g.group}>
                            <h4>{g.group}</h4>
                            <div className='ab-tags'>
                                {g.items.map((t) => <span key={t}>{t}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------------- WHAT I LEARNED ---------------- */}
            <section className='ab-section'>
                <div className='ab-section-head'>
                    <span className='ab-eyebrow'>Takeaways</span>
                    <h3>What I learned building it</h3>
                </div>
                <ul className='ab-learned'>
                    {LEARNED.map((l) => (
                        <li key={l}><CheckCircleIcon /> {l}</li>
                    ))}
                </ul>
            </section>

            {/* ---------------- CONTACT ---------------- */}
            <section className='ab-final'>
                <DevicesIcon className='ab-final-icon' />
                <h3>Let's connect</h3>
                <p>Have feedback, a question, or an idea to build together? I'd love to hear from you.</p>
                <div className='ab-cta ab-cta-center'>
                    {DEV.email && (
                        <a className='ab-btn ab-btn-white' href={`mailto:${DEV.email}`}><EmailOutlinedIcon /> {DEV.email}</a>
                    )}
                    {DEV.linkedin && (
                        <a className='ab-btn ab-btn-outline' href={DEV.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon /> LinkedIn</a>
                    )}
                    {DEV.repo && (
                        <a className={`ab-btn ${DEV.email ? 'ab-btn-outline' : 'ab-btn-white'}`} href={DEV.repo} target="_blank" rel="noopener noreferrer">
                            <GitHubIcon /> View source code <ArrowForwardIcon />
                        </a>
                    )}
                </div>
            </section>

            <footer className='ab-footer'>
                &copy; {new Date().getFullYear()} EchoMeet &middot; Built by {DEV.name}
            </footer>
        </div>
    )
}