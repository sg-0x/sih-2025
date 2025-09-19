import React, { useMemo, useState } from 'react';

const CATEGORIES = [
  { id: 'earthquake', name: 'Earthquake' },
  { id: 'flood', name: 'Flood' },
  { id: 'fire', name: 'Fire Safety' },
  { id: 'cyclone', name: 'Cyclone' },
  { id: 'landslide', name: 'Landslide' }
];

// Video mapping based on actual files in public/Videos folder
const VIDEO_MODULES = {
  earthquake: [
    { 
      id: 'eq-bend-cover-hold', 
      title: 'Bend Cover Hold', 
      videoPath: '/Videos/Earthquake/Bend Cover Hold.mp4',
      minutes: 4 
    },
    { 
      id: 'eq-dos-donts', 
      title: 'Earthquake - DOs & DONTs', 
      videoPath: '/Videos/Earthquake/Earthquake - DOs & DONTs.mp4',
      minutes: 5 
    },
    { 
      id: 'eq-outdoors-safety', 
      title: 'How to Stay Safe if outdoors during an earthquake', 
      videoPath: '/Videos/Earthquake/How to Stay Safe if outdoors during an earthquake.mp4',
      minutes: 6 
    }
  ],
  flood: [
    { 
      id: 'flood-dos-donts', 
      title: 'Dos and Donts to follow during a flood', 
      videoPath: '/Videos/Flood/Dos and Donts to follow during a flood.mp4',
      minutes: 5 
    },
    { 
      id: 'flood-secure-after', 
      title: 'Here are some ways by which you can secure yourself after a flood', 
      videoPath: '/Videos/Flood/Here are some ways by which you can secure yourself after a flood.mp4',
      minutes: 6 
    },
    { 
      id: 'flood-prepare-before', 
      title: 'Know how you can stay prepared before floods', 
      videoPath: '/Videos/Flood/Know how you can stay prepared before floods',
      minutes: 5 
    }
  ],
  fire: [
    { 
      id: 'fire-safety-kids', 
      title: 'Fire Safety for Kids', 
      videoPath: '/Videos/Fire Safety/Fire Safety for Kids.mp4',
      minutes: 4 
    },
    { 
      id: 'fire-tips-dos-donts', 
      title: 'Fire Tips - Do\'s and don\'ts & must haves', 
      videoPath: '/Videos/Fire Safety/Fire Tips - Do\'s and don\'ts & must haves.mp4',
      minutes: 5 
    }
  ],
  cyclone: [
    { 
      id: 'cyclone-early-warning', 
      title: 'Know where all you can get early warning information for cyclones', 
      videoPath: '/Videos/Cyclone/Know where all you can get early warning information for cyclones.mp4',
      minutes: 6 
    },
    { 
      id: 'cyclone-prepare', 
      title: 'Prepare yourself for a cyclone with these do\'s and don\'ts', 
      videoPath: '/Videos/Cyclone/Prepare yourself for a cyclone with these do\'s and don\'ts.mp4',
      minutes: 5 
    },
    { 
      id: 'cyclone-secure-house', 
      title: 'Secure your house from a cyclone with these methods', 
      videoPath: '/Videos/Cyclone/Secure your house from a cyclone with these methods.mp4',
      minutes: 6 
    }
  ],
  landslide: [
    { 
      id: 'landslide-prepare', 
      title: 'How to stay prepared for a landslide', 
      videoPath: '/Videos/Landslide/How to stay prepared for a landslide_.mp4',
      minutes: 5 
    },
    { 
      id: 'landslide-stay-safe', 
      title: 'How to stay safe during a landslide', 
      videoPath: '/Videos/Landslide/How to stay safe during a landslide_.mp4',
      minutes: 4 
    },
    { 
      id: 'landslide-reasons', 
      title: 'What are the reasons for a landslide', 
      videoPath: '/Videos/Landslide/What are the reasons for a landslide_.mp4',
      minutes: 5 
    }
  ]
};

// Region-specific disaster priorities based on disaster dataset
const REGION_PRIORITIES = {
  'IN-AS': ['flood', 'earthquake'], // Assam - prone to floods and earthquakes
  'IN-HP': ['landslide', 'earthquake'], // Himachal Pradesh - prone to landslides and earthquakes
  'IN-GJ': ['cyclone', 'earthquake'], // Gujarat - prone to cyclones and earthquakes
  'IN-MH': ['cyclone', 'flood'] // Maharashtra - prone to cyclones and floods
};

function Learn() {
  const [region, setRegion] = useState('IN-HP');
  const [progress, setProgress] = useState({});
  const [category, setCategory] = useState('earthquake');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const recommended = useMemo(() => {
    // Get priority disasters for the selected region
    const priorityDisasters = REGION_PRIORITIES[region] || ['earthquake', 'fire'];
    
    // Get all videos for priority disasters
    const recommendedVideos = [];
    priorityDisasters.forEach(disaster => {
      if (VIDEO_MODULES[disaster]) {
        recommendedVideos.push(...VIDEO_MODULES[disaster]);
      }
    });
    
    return recommendedVideos;
  }, [region]);

  const visible = useMemo(() => VIDEO_MODULES[category] || [], [category]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleVideoClose = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="row g-3">
      <div className="col-12 col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center gap-2"><i className="bi bi-geo-alt text-primary"></i>Your Region</h5>
            <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="IN-AS">Assam</option>
              <option value="IN-HP">Himachal Pradesh</option>
              <option value="IN-GJ">Gujarat</option>
              <option value="IN-MH">Maharashtra</option>
            </select>
          </div>
        </div>
        <div className="card mt-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center gap-2"><i className="bi bi-stars text-warning"></i>Recommended Courses</h5>
            <p className="text-muted small mb-3">Based on your region's disaster risk profile</p>
            <ul className="list-group">
              {recommended.map((video) => (
                <li 
                  key={video.id} 
                  className="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div>
                    <div className="fw-medium">{video.title}</div>
                    <small className="text-muted text-capitalize">{video.id.split('-')[0]}</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary rounded-pill">{video.minutes}m</span>
                    <i className="bi bi-play-circle text-primary"></i>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-8">
        <div className="d-flex align-items-center justify-content-between mb-2 p-3 rounded-4 border bg-white shadow-sm">
          <h4 className="mb-0 d-flex align-items-center gap-2"><i className="bi bi-mortarboard text-primary"></i>Modules</h4>
          <select className="form-select w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="row g-3">
          {visible.map((video) => (
            <div key={video.id} className="col-12 col-lg-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{video.title}</h5>
                  <p className="card-text">Educational video with practical safety information.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">{video.minutes} minutes</span>
                    <button 
                      className="btn btn-outline-primary btn-sm" 
                      onClick={() => handleVideoSelect(video)}
                    >
                      <i className="bi bi-play-fill me-1"></i>Watch Video
                    </button>
                  </div>
                  <div className="progress mt-3" role="progressbar" aria-label="module progress" aria-valuenow={progress[video.id] || 0} aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar" style={{ width: `${progress[video.id] || 0}%` }}>{progress[video.id] ? `${progress[video.id]}%` : ''}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedVideo.title}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleVideoClose}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="ratio ratio-16x9">
                    <video 
                      controls 
                      className="rounded"
                      onEnded={() => setProgress((p) => ({ ...p, [selectedVideo.id]: 100 }))}
                    >
                      <source src={selectedVideo.videoPath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleVideoClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Learn;


