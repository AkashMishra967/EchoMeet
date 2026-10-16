import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, Tooltip } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import server from '../environment';
import { useNavigate, useParams } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    // lobby helpers
    const lobbyNavigate = useNavigate();
    const { url: roomCode } = useParams();
    const chatEndRef = useRef(null);

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

   let [showModal, setModal] = useState(false);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // Which tile is shown full screen: null (normal grid) | 'local' | remote socketId
    let [focusedId, setFocusedId] = useState(null)

    // If the focused remote user leaves, fall back to the normal layout
    const activeFocus = (focusedId === 'local' || videos.some(v => v.socketId === focusedId)) ? focusedId : null

    const toggleFocus = (id) => setFocusedId(prev => (prev === id ? null : id))

    // Everyone who is NOT focused becomes a small thumbnail (stacked on the right)
    const thumbIds = ['local', ...videos.map(v => v.socketId)].filter(id => id !== activeFocus)

    const getTileClass = (id) => {
        if (activeFocus === null) return ''
        return activeFocus === id ? styles.tileFocused : styles.tileThumb
    }
    const getLocalClass = () => {
        if (activeFocus === null) return styles.meetUserVideo
        return `${styles.meetUserVideo} ${activeFocus === 'local' ? styles.localFocused : styles.localThumb}`
    }

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    })

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    // keep the newest chat message in view
    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages, showModal]);

    let sendMessage = () => {
        if (!message.trim()) return;
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }

    
    let connect = () => {
        if (!username.trim()) setUsername("Guest");
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>

            {askForUsername === true ?

                <div className={styles.lobby}>

                    {/* top bar */}
                    <header className={styles.lobbyNav}>
                        <div className={styles.lobbyLogo} onClick={() => lobbyNavigate("/")}>
                            <span className={styles.lobbyLogoIcon}><VideocamIcon /></span>
                            <span className={styles.lobbyLogoText}>Echo<b>Meet</b></span>
                        </div>
                        <button className={styles.lobbyBack} onClick={() => lobbyNavigate("/")}>
                            <ArrowBackIcon /> <span>Back to home</span>
                        </button>
                    </header>

                    <main className={styles.lobbyMain}>

                        {/* ---------- camera preview ---------- */}
                        <section className={styles.lobbyPreview}>
                            <div className={styles.lobbyVideoWrap}>
                                <video ref={localVideoref} autoPlay muted playsInline></video>

                                <div className={styles.lobbyStatus}>
                                    <span className={videoAvailable ? styles.ok : styles.bad}>
                                        {videoAvailable ? <VideocamIcon /> : <VideocamOffIcon />}
                                        {videoAvailable ? "Camera ready" : "Camera blocked"}
                                    </span>
                                    <span className={audioAvailable ? styles.ok : styles.bad}>
                                        {audioAvailable ? <MicIcon /> : <MicOffIcon />}
                                        {audioAvailable ? "Mic ready" : "Mic blocked"}
                                    </span>
                                </div>
                            </div>
                            <p className={styles.lobbyHint}>
                                This is how others will see you. Allow camera and microphone
                                access in your browser if the preview is empty.
                            </p>
                        </section>

                        {/* ---------- join card ---------- */}
                        <section className={styles.lobbyCard}>
                            <span className={styles.lobbyBadge}>
                                <span className={styles.lobbyDot}></span> Ready to join
                            </span>

                            <h2>Join the <span className={styles.lobbyAccent}>meeting</span></h2>
                            <p className={styles.lobbySub}>Enter your name so everyone knows who you are.</p>

                            {roomCode && (
                                <div className={styles.lobbyCode}>
                                    <span>Meeting code</span>
                                    <strong>{decodeURIComponent(roomCode)}</strong>
                                </div>
                            )}

                            <form
                                className={styles.lobbyForm}
                                onSubmit={(e) => { e.preventDefault(); connect(); }}
                            >
                                <label htmlFor="lobby-name">Your name</label>
                                <div className={styles.lobbyInput}>
                                    <PersonOutlineIcon />
                                    <input
                                        id="lobby-name"
                                        type="text"
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        autoFocus
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className={styles.lobbyJoin}>
                                    Join now <ArrowForwardIcon />
                                </button>
                            </form>

                            <p className={styles.lobbyNote}><LockOutlinedIcon /> Private &amp; secure &middot; No downloads required</p>
                        </section>
                    </main>
                </div> :


                <div className={styles.meetVideoContainer}>

                    {/* ---------- meeting info chip ---------- */}
                    <div className={styles.meetInfo}>
                        <span className={styles.meetLive}><span className={styles.meetLiveDot}></span> Live</span>
                        {roomCode && <span className={styles.meetCode}>{decodeURIComponent(roomCode)}</span>}
                        <span className={styles.meetCount}><PeopleAltOutlinedIcon /> {videos.length + 1}</span>
                    </div>

                    {/* ---------- chat panel ---------- */}
                    {showModal ? <div className={styles.chatRoom}>

                        <div className={styles.chatHead}>
                            <div>
                                <h3>In-call chat</h3>
                                <span>{messages.length} message{messages.length === 1 ? "" : "s"}</span>
                            </div>
                            <IconButton onClick={closeChat} className={styles.chatClose} aria-label="Close chat">
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <div className={styles.chatBody}>
                            {messages.length !== 0 ? messages.map((item, index) => {
                                const mine = item.sender === username;
                                return (
                                    <div className={`${styles.msgRow} ${mine ? styles.msgMine : ''}`} key={index}>
                                        {!mine && <span className={styles.msgSender}>{item.sender}</span>}
                                        <div className={styles.msgBubble}>{item.data}</div>
                                    </div>
                                )
                            }) : (
                                <div className={styles.chatEmpty}>
                                    <ChatBubbleOutlineIcon />
                                    <strong>No messages yet</strong>
                                    <span>Say hello to everyone in the call.</span>
                                </div>
                            )}
                            <div ref={chatEndRef}></div>
                        </div>

                        <form
                            className={styles.chatForm}
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        >
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                aria-label="Message"
                            />
                            <button type="submit" className={styles.chatSend} disabled={!message.trim()} aria-label="Send message">
                                <SendRoundedIcon />
                            </button>
                        </form>
                    </div> : <></>}


                    {/* ---------- call controls ---------- */}
                    <div className={styles.buttonContainers}>

                        <Tooltip title={video === true ? "Turn off camera" : "Turn on camera"} arrow placement="top">
                            <IconButton
                                onClick={handleVideo}
                                className={`${styles.ctrlBtn} ${video === true ? '' : styles.ctrlOff}`}
                                aria-label="Toggle camera"
                            >
                                {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={audio === true ? "Mute microphone" : "Unmute microphone"} arrow placement="top">
                            <IconButton
                                onClick={handleAudio}
                                className={`${styles.ctrlBtn} ${audio === true ? '' : styles.ctrlOff}`}
                                aria-label="Toggle microphone"
                            >
                                {audio === true ? <MicIcon /> : <MicOffIcon />}
                            </IconButton>
                        </Tooltip>

                        {screenAvailable === true ?
                            <Tooltip title={screen === true ? "Stop sharing" : "Share screen"} arrow placement="top">
                                <IconButton
                                    onClick={handleScreen}
                                    className={`${styles.ctrlBtn} ${screen === true ? styles.ctrlActive : ''}`}
                                    aria-label="Share screen"
                                >
                                    {screen === true ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                                </IconButton>
                            </Tooltip> : <></>}

                        <Badge
                            badgeContent={showModal ? 0 : newMessages}
                            max={99}
                            sx={{ '& .MuiBadge-badge': { background: '#f59e0b', color: '#fff', fontWeight: 700, top: 6, right: 6 } }}
                        >
                            <Tooltip title={showModal ? "Close chat" : "Open chat"} arrow placement="top">
                                <IconButton
                                    onClick={() => (showModal ? closeChat() : openChat())}
                                    className={`${styles.ctrlBtn} ${showModal ? styles.ctrlActive : ''}`}
                                    aria-label="Toggle chat"
                                >
                                    <ChatIcon />
                                </IconButton>
                            </Tooltip>
                        </Badge>

                        <span className={styles.ctrlDivider}></span>

                        <Tooltip title="Leave call" arrow placement="top">
                            <IconButton
                                onClick={handleEndCall}
                                className={`${styles.ctrlBtn} ${styles.ctrlEnd}`}
                                aria-label="Leave call"
                            >
                                <CallEndIcon />
                            </IconButton>
                        </Tooltip>

                    </div>


                    <video
                        className={getLocalClass()}
                        style={{ '--i': Math.max(thumbIds.indexOf('local'), 0), cursor: 'pointer' }}
                        onClick={() => toggleFocus('local')}
                        ref={localVideoref}
                        autoPlay
                        muted
                        playsInline
                    ></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div
                                key={video.socketId}
                                className={getTileClass(video.socketId)}
                                style={{ '--i': Math.max(thumbIds.indexOf(video.socketId), 0), cursor: 'pointer' }}
                                onClick={() => toggleFocus(video.socketId)}
                            >
                                <video

                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>

                        ))}

                    </div>

                </div>

            }

        </div>
    )
}