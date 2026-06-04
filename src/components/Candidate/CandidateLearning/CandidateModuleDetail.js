import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import "../../Admin/Learning/Learning.css";
import { FaBook, FaClock, FaCheckCircle, FaVideo, FaChevronDown, FaChevronUp, FaPlay, FaArrowLeft } from "react-icons/fa";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const CandidateModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState({});
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const [candidate, setCandidate] = useState(null);
  const videoRefs = useRef({});

  const progressEndpoint = `${BASE_URL}/api/mentor/candidate-progress/`;
  const progressUpdateEndpoint = `${BASE_URL}/api/mentor/candidate-video-session-progress/`;

  const loadVideoProgress = useCallback(async () => {
    if (!candidate || !module?.sessions) return;

    try {
      const params = new URLSearchParams({
        candidate_id: candidate.id,
        module_id: module.id,
      });

      const response = await fetch(`${progressEndpoint}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to load progress: ${response.status}`);
      }

      const result = await response.json();
      if (result.status && result.data) {
        const progressMap = {};
        result.data.forEach((item) => {
          if (item.video && item.watched_seconds !== undefined && item.watched_seconds !== null) {
            progressMap[item.video] = Number(item.watched_seconds);
          }
        });
        setVideoProgress(progressMap);
      }
    } catch (err) {
      console.error('Error loading candidate video progress:', err);
    }
  }, [candidate, module]);

  useEffect(() => {
    loadVideoProgress();
  }, [loadVideoProgress]);

  const updateVideoProgress = async (videoId, currentTime) => {
    if (!candidate) return;

    const watched_seconds = Math.max(0, Math.floor(currentTime));

    try {
      const response = await fetch(progressUpdateEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidate: candidate.id,
          video: videoId,
          watched_seconds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Video progress save failed', errorData || response.statusText);
        return;
      }

      const result = await response.json();
      if (result.status && result.data) {
        setVideoProgress((prev) => ({ ...prev, [videoId]: Number(result.data.watched_seconds) }));
      }
    } catch (err) {
      console.error('Error saving candidate video progress:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercent = (video) => {
    const watched = videoProgress[video.id] || 0;
    if (!video.duration_seconds || video.duration_seconds <= 0) return 0;
    return Math.min(100, Math.round((watched / video.duration_seconds) * 100));
  };

  useEffect(() => {
    if (!playingVideoId) return;
    const activeVideo = videoRefs.current[playingVideoId];
    if (!activeVideo) return;
    const watched = videoProgress[playingVideoId] || 0;
    if (watched > 0 && activeVideo.currentTime < watched) {
      activeVideo.currentTime = watched;
    }
  }, [playingVideoId, videoProgress]);

  useEffect(() => {
    const storedUser = localStorage.getItem("candidate_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const actualId = parsedUser.user_id || parsedUser.id || parsedUser.pk;
      setCandidate({ ...parsedUser, id: actualId });
    }
  }, []);

  const handleLoadedMetadata = (videoId) => {
    const savedTime = videoProgress[videoId] || 0;
    const videoElement = videoRefs.current[videoId];
    if (videoElement && savedTime > 0 && videoElement.currentTime < savedTime) {
      videoElement.currentTime = savedTime;
    }
  };

  const handleTimeUpdate = (videoId, sessionId, event) => {
    const currentTime = event.target.currentTime;
    updateVideoProgress(videoId, currentTime);
  };

  const fetchModuleDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/mentor/learning-modules/${id}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        setModule(result.data);
        // Expand the first session by default
        if (result.data.sessions && result.data.sessions.length > 0) {
          setExpandedSessions({ [result.data.sessions[0].id]: true });
        }
      } else {
        throw new Error(result.message || 'Failed to fetch module details');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching module details:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchModuleDetail();
  }, [fetchModuleDetail]);

  const toggleSession = (sessionId) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const formatDuration = (hours) => {
    if (!hours || hours === '0.0') return 'N/A';
    return `${hours} ${parseFloat(hours) === 1 ? 'hour' : 'hours'}`;
  };

  const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleVideoPlay = (videoId) => {
    setPlayingVideoId(videoId);
  };

  if (loading) {
    return (
      <div className="cld-layout-wrapper">
        <CandidateSidebar />
        <div className="cld-main-wrapper">
          <Header />
          <div className="learning-loading">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading module content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="cld-layout-wrapper">
        <CandidateSidebar />
        <div className="cld-main-wrapper">
          <Header />
          <div className="learning-error">
            <p>{error || "Module not found"}</p>
            <button className="btn btn-primary" onClick={() => navigate('/candidate-learning')}>
              Back to Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalVideos = module.sessions?.reduce((total, session) => total + (session.videos?.length || 0), 0) || 0;

  return (
    <div className="cld-layout-wrapper">
      <CandidateSidebar />
      <div className="cld-main-wrapper">
        <Header />
        <div className="cld-content-area">
          <div className="module-detail-container">
            {/* Back Button */}
            <button className="btn btn-link mb-3 p-0 d-flex align-items-center text-decoration-none" onClick={() => navigate('/candidate-learning')}>
              <FaArrowLeft className="me-2" /> Back to Learning
            </button>

            {/* Module Header Card */}
            <div className="module-detail-header">
              <div className="module-detail-thumb">
                {module.thumbnail ? (
                  <img src={getMediaUrl(module.thumbnail)} alt={module.title} />
                ) : (
                  <div className="learning-card-placeholder"><FaBook /></div>
                )}
              </div>
              <div className="module-detail-info">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h1>{module.title}</h1>
                    <p className="module-detail-desc">{module.description}</p>
                  </div>
                  <div className="module-detail-badges">
                    {module.is_mandatory && <span className="learning-pill mandatory">Mandatory</span>}
                  </div>
                </div>
                
                <div className="learning-card-meta">
                  <div className="meta-item"><FaClock /> <span>{formatDuration(module.duration_hours)}</span></div>
                  <div className="meta-item"><FaCheckCircle /> <span>{module.sessions?.length || 0} Sessions</span></div>
                  <div className="meta-item"><FaVideo /> <span>{totalVideos} Videos</span></div>
                </div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="session-list">
              <h3>Course Content</h3>
              {module.sessions && module.sessions.length > 0 ? (
                module.sessions.map((session, index) => (
                  <div key={session.id} className="session-accordion-item">
                    <div className="session-accordion-header" onClick={() => toggleSession(session.id)}>
                      <div className="session-title-box">
                        <div className="session-number">{index + 1}</div>
                        <h4>{session.title}</h4>
                      </div>
                      <div className="session-meta">
                        <div className="session-meta-item">
                          <FaVideo className="me-1" /> {session.videos?.length || 0} Videos
                        </div>
                        {expandedSessions[session.id] ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                    
                    {expandedSessions[session.id] && (
                      <div className="session-accordion-content">
                        <p className="text-muted mb-4">{session.description || "No session description available."}</p>
                        <div className="video-list-grid">
                          {session.videos && session.videos.length > 0 ? (
                            session.videos.map((video) => {
                              const watchedSeconds = videoProgress[video.id] || 0;
                              const progressPercent = getProgressPercent(video);
                              return (
                                <div key={video.id} className="video-item-card">
                                  <div className="video-item-thumb" style={{ position: 'relative' }}>
                                    {playingVideoId === video.id ? (
                                      <video
                                        ref={(el) => { if (el) videoRefs.current[video.id] = el; }}
                                        className="w-100 h-100"
                                        controls
                                        autoPlay
                                        controlsList="nodownload"
                                        onContextMenu={(e) => e.preventDefault()}
                                        onLoadedMetadata={() => handleLoadedMetadata(video.id)}
                                        onTimeUpdate={(e) => handleTimeUpdate(video.id, session.id, e)}
                                      >
                                        <source src={getMediaUrl(video.video)} type="video/mp4" />
                                        Your browser does not support the video tag.
                                      </video>
                                    ) : (
                                      <>
                                        {video.thumbnail ? (
                                          <img src={getMediaUrl(video.thumbnail)} alt={video.title} />
                                        ) : (
                                          <div className="w-100 h-100 bg-dark d-flex align-items-center justify-content-center">
                                            <FaVideo color="#fff" />
                                          </div>
                                        )}
                                        <div className="video-play-overlay" onClick={() => handleVideoPlay(video.id)}>
                                          <FaPlay />
                                        </div>
                                        {watchedSeconds > 0 && (
                                          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px', background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '12px' }}>
                                            Resume from {formatTime(watchedSeconds)}
                                            <div style={{ height: 4, marginTop: 6, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                              <div style={{ width: `${progressPercent}%`, height: '100%', background: '#f56565' }} />
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    {video.duration_seconds > 0 && playingVideoId !== video.id && (
                                      <div className="video-item-duration">
                                        {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                                      </div>
                                    )}
                                  </div>
                                  <div className="video-item-info">
                                    <h5>{video.title}</h5>
                                    <p title={video.description}>{video.description || "No description"}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="col-12 text-center py-3 text-muted">
                              No videos in this session
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-5 bg-white rounded-3 border">
                  <FaBook size={48} className="text-muted mb-3" />
                  <p>No sessions found for this module.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateModuleDetail;