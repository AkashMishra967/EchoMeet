import React, { useState } from 'react';
import "../App.css";
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const router = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const goTo = (path) => {
        setMenuOpen(false);
        router(path);
    };

    return (
        <div className="landingPageContainer">

            {/* Fixed Navigation Bar */}
            <nav className="landingNav">

                <Link
                    to="/"
                    className="brandMark"
                    aria-label="Apna Video Call home"
                >
                    <span className="brandIcon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                            <rect
                                x="3"
                                y="6"
                                width="12"
                                height="12"
                                rx="3"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />

                            <path
                                d="m15 10 5-3v10l-5-3"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>

                    <span>
                        Apna <strong>Video Call</strong>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navlist">

                    <button
                        className="navTextButton"
                        onClick={() => goTo('/aljk23')}
                    >
                        Join as Guest
                    </button>

                    <button
                        className="navTextButton"
                        onClick={() => goTo('/auth')}
                    >
                        Register
                    </button>

                    <button
                        className="navLoginButton"
                        onClick={() => goTo('/auth')}
                    >
                        Log in <span aria-hidden="true">→</span>
                    </button>

                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="hamburger"
                    type="button"
                    aria-label={
                        menuOpen
                            ? 'Close navigation menu'
                            : 'Open navigation menu'
                    }
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? '×' : '☰'}
                </button>

            </nav>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="mobileMenu">

                    <button onClick={() => goTo('/aljk23')}>
                        Join as Guest
                    </button>

                    <button onClick={() => goTo('/auth')}>
                        Register
                    </button>

                    <button onClick={() => goTo('/auth')}>
                        Log in
                    </button>

                </div>
            )}

            {/* Main Hero Section */}
            <main className="landingMainContainer">

                {/* Left Content */}
                <section className="heroCopy">

                    <div className="heroEyebrow">
                        <span className="liveDot"></span>
                        SIMPLE. PERSONAL. CONNECTED.
                    </div>

                    <h1>
                        Closer to the people
                        <span>who matter.</span>
                    </h1>

                    <p className="heroDescription">
                        Great conversations can happen anywhere.
                        Start a video call and make every distance
                        feel a little smaller.
                    </p>

                    {/* Action Buttons */}
                    <div className="heroActions">

                        <Link
                            className="primaryCta"
                            to="/auth"
                        >
                            Get started
                            <span aria-hidden="true">↗</span>
                        </Link>

                        <button
                            className="secondaryCta"
                            onClick={() => goTo('/aljk23')}
                        >
                            Join as guest
                        </button>

                    </div>

                    {/* Small Trust Message */}
                    <div className="heroNote">

                        <span className="noteIcon">
                            ✓
                        </span>

                        <span>
                            Easy to start
                            <b>·</b>
                            Made for real conversations
                        </span>

                    </div>

                </section>

                {/* Right Illustration */}
                <section
                    className="heroVisual"
                    aria-label="Video calling illustration"
                >

                    <div className="visualGlow"></div>

                    <div className="visualBadge badgeTop">

                        <span className="badgeIcon">
                            ✦
                        </span>

                        <span>
                            <strong>Stay connected</strong>
                            <small>
                                Wherever life takes you
                            </small>
                        </span>

                    </div>

                    <img
                        className="heroPhoneImage"
                        src="/mobile.png"
                        alt="Illustration of a video call on a mobile phone"
                    />

                    <div className="visualBadge badgeBottom">

                        <span className="onlineAvatar">
                            A
                        </span>

                        <span>
                            <strong>Your people, closer</strong>
                            <small>One call away</small>
                        </span>

                        <span
                            className="onlineStatus"
                            aria-label="Online"
                        ></span>

                    </div>

                </section>

            </main>

            {/* Features Section */}
            <section
                className="featureStrip"
                aria-label="Why use Apna Video Call"
            >

                <div className="featureItem">

                    <span className="featureIcon">
                        ↗
                    </span>

                    <span>
                        <strong>Quick to join</strong>
                        <small>
                            Start with just a few clicks
                        </small>
                    </span>

                </div>

                <div className="featureDivider"></div>

                <div className="featureItem">

                    <span className="featureIcon">
                        ◎
                    </span>

                    <span>
                        <strong>Personal connection</strong>
                        <small>
                            Make time for your people
                        </small>
                    </span>

                </div>

                <div className="featureDivider"></div>

                <div className="featureItem">

                    <span className="featureIcon">
                        ⌁
                    </span>

                    <span>
                        <strong>From anywhere</strong>
                        <small>
                            Connect across the distance
                        </small>
                    </span>

                </div>

            </section>

            {/* Footer */}
            <footer className="landingFooter">
                A little closer, wherever you are.
            </footer>

        </div>
    );
}