import * as React from 'react';
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "./authentication.css";

import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ChatIcon from '@mui/icons-material/Chat';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import HdIcon from '@mui/icons-material/Hd';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HIGHLIGHTS = [
    { icon: <HdIcon />, title: "HD video & audio", text: "Smooth peer-to-peer calls with low latency." },
    { icon: <ScreenShareIcon />, title: "Screen sharing", text: "Present to everyone with a single click." },
    { icon: <ChatIcon />, title: "Live chat", text: "Message the room without leaving the call." },
    { icon: <TouchAppIcon />, title: "Click to focus", text: "Tap anyone to bring them full screen." },
];

export default function Authentication() {

    const navigate = useNavigate();

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState();

    const [formState, setFormState] = React.useState(0);   // 0 = Sign In, 1 = Sign Up

    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        setLoading(true);
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password)

            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {

            console.log(err);
            let message = err?.response?.data?.message || "Something went wrong. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    const switchMode = (mode) => {
        setFormState(mode);
        setError("");
    }

    const isLogin = formState === 0;

    return (
        <div className='au'>

            {/* ================= LEFT : BRAND PANEL ================= */}
            <aside className='au-left'>
                <div className='au-left-bg'></div>

                <div className='au-left-inner'>
                    <div className='au-logo' onClick={() => navigate("/")}>
                        <span className='au-logo-icon'><VideocamIcon /></span>
                        <span className='au-logo-text'>Echo<b>Meet</b></span>
                    </div>

                    <div className='au-left-main'>
                        <h1>
                            Meetings that feel <span className='au-accent'>effortless</span>
                        </h1>
                        <p className='au-left-sub'>
                            Sign in to host or join secure HD video calls with screen sharing
                            and live chat &mdash; right from your browser.
                        </p>

                        {/* Mini product mockup */}
                        <div className='au-mock' aria-hidden="true">
                            <div className='au-mock-stage'>
                                <div className='au-mock-main'>
                                    <div className='au-mock-avatar'>
                                        <span className='au-mock-ring'></span>A
                                    </div>
                                    <span className='au-mock-name'><MicIcon /> Akash</span>
                                </div>
                                <div className='au-mock-thumbs'>
                                    <div className='au-mock-thumb t1'>R</div>
                                    <div className='au-mock-thumb t2'>S</div>
                                    <div className='au-mock-thumb t3'>Y</div>
                                </div>
                            </div>
                            <div className='au-mock-controls'>
                                <span><VideocamIcon /></span>
                                <span><MicIcon /></span>
                                <span className='end'><CallEndIcon /></span>
                                <span><ScreenShareIcon /></span>
                                <span><ChatIcon /></span>
                            </div>
                        </div>

                        <ul className='au-highlights'>
                            {HIGHLIGHTS.map((h) => (
                                <li key={h.title}>
                                    <span className='au-hl-icon'>{h.icon}</span>
                                    <div>
                                        <strong>{h.title}</strong>
                                        <span>{h.text}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='au-left-foot'>
                        <LockOutlinedIcon /> Private &amp; secure &middot; No downloads required
                    </div>
                </div>
            </aside>

            {/* ================= RIGHT : FORM ================= */}
            <main className='au-right'>
                <button className='au-back' onClick={() => navigate("/")}>
                    <ArrowBackIcon /> Back to home
                </button>

                <div className='au-card'>
                    {/* Compact logo (shown on mobile where the left panel is hidden) */}
                    <div className='au-logo au-logo-mobile' onClick={() => navigate("/")}>
                        <span className='au-logo-icon'><VideocamIcon /></span>
                        <span className='au-logo-text'>Echo<b>Meet</b></span>
                    </div>

                    <div className='au-head'>
                        <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
                        <p>
                            {isLogin
                                ? "Sign in to continue to your meetings."
                                : "Join EchoMeet and start your first call in seconds."}
                        </p>
                    </div>

                    {/* Sign In / Sign Up switch */}
                    <div className={`au-tabs ${isLogin ? 'is-login' : 'is-signup'}`} role="tablist">
                        <span className='au-tab-pill'></span>
                        <button type="button" role="tab" aria-selected={isLogin} className={isLogin ? 'active' : ''} onClick={() => switchMode(0)}>
                            Sign In
                        </button>
                        <button type="button" role="tab" aria-selected={!isLogin} className={!isLogin ? 'active' : ''} onClick={() => switchMode(1)}>
                            Sign Up
                        </button>
                    </div>

                    <form
                        className='au-form'
                        noValidate
                        onSubmit={(e) => { e.preventDefault(); if (!loading) handleAuth(); }}
                    >
                        {!isLogin && (
                            <div className='au-field'>
                                <label htmlFor="fullname">Full Name</label>
                                <div className='au-input'>
                                    <BadgeOutlinedIcon />
                                    <input
                                        id="fullname"
                                        name="fullname"
                                        type="text"
                                        placeholder="Your full name"
                                        autoComplete="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        <div className='au-field'>
                            <label htmlFor="username">Username</label>
                            <div className='au-input'>
                                <PersonOutlineIcon />
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoFocus={isLogin}
                                />
                            </div>
                        </div>

                        <div className='au-field'>
                            <label htmlFor="password">Password</label>
                            <div className='au-input'>
                                <LockOutlinedIcon />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className='au-eye'
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </button>
                            </div>
                        </div>

                        {error && <div className='au-error' role="alert">{error}</div>}

                        <button type="submit" className='au-submit' disabled={loading}>
                            {loading
                                ? <span className='au-spinner'></span>
                                : <>{isLogin ? "Login" : "Create account"} <ArrowForwardIcon /></>}
                        </button>
                    </form>

                    <p className='au-switch'>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button type="button" onClick={() => switchMode(isLogin ? 1 : 0)}>
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </p>

                    <div className='au-divider'><span>or</span></div>

                    <button type="button" className='au-guest' onClick={() => navigate("/aljk23")}>
                        Continue as Guest
                    </button>

                    <p className='au-note'><CheckCircleIcon /> No credit card required</p>
                </div>
            </main>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}