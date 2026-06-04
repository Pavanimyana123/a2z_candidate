import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Learning.css";
import { FaBook, FaClock, FaCheckCircle, FaVideo, FaChevronDown, FaChevronUp, FaPlay, FaArrowLeft } from "react-icons/fa";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState({});
  const [playingVideoId, setPlayingVideoId] = useState(null);

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

  if (loading) {
    return (
      <div className="ta-layout-wrapper">
        <Sidebar />
        <div className="ta-main-wrapper">
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
      <div className="ta-layout-wrapper">
        <Sidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="learning-error">
            <p>{error || "Module not found"}</p>
            <button className="btn btn-primary" onClick={() => navigate('/learning')}>
              Back to Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalVideos = module.sessions?.reduce((total, session) => total + (session.videos?.length || 0), 0) || 0;

  return (
    <div className="ta-layout-wrapper">
      <Sidebar />
      <div className="ta-main-wrapper">
        <Header />
        <div className="ta-content-area">
          <div className="module-detail-container">
            {/* Back Button */}
            <button className="btn btn-link mb-3 p-0 d-flex align-items-center text-decoration-none" onClick={() => navigate('/learning')}>
              <FaArrowLeft className="me-2" /> Back to Modules
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
                    <span className={`learning-pill ${module.is_active ? 'active' : 'inactive'}`}>
                      {module.is_active ? 'Active' : 'Inactive'}
                    </span>
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
                            session.videos.map((video) => (
                              <div key={video.id} className="video-item-card">
                                <div className="video-item-thumb">
                                  {playingVideoId === video.id ? (
                                    <video 
                                      className="w-100 h-100" 
                                      controls 
                                      autoPlay 
                                      controlsList="nodownload"
                                      onContextMenu={(e) => e.preventDefault()}
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
                                      <div className="video-play-overlay" onClick={() => setPlayingVideoId(video.id)}>
                                        <FaPlay />
                                      </div>
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
                            ))
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

export default ModuleDetail;