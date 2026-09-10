import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDetect = () => {
    if (!image) return;

    // Temporary demo result.
    // Your real YOLO/backend API can be connected here later.
    setResult({
      potholes: 3,
      severity: "Moderate",
      confidence: "94%",
      location: "GPS location pending",
    });
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">🛣️</span>
          <span>PotholeAI</span>
        </div>

        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#detection">Detection</a>
          <a href="#history">History</a>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="status">
          <span className="status-dot"></span>
          AI-POWERED ROAD INSPECTION
        </div>

        <h1>
          Intelligent Pothole
          <br />
          <span>Detection System</span>
        </h1>

        <p>
          Detect and assess road damage using AI-powered computer
          vision technology.
        </p>
      </section>

      {/* DASHBOARD */}
      <main className="dashboard" id="dashboard">

        <div className="section-title">
          <h2>Road Inspection Dashboard</h2>
          <p>
            Monitor road conditions and identify potholes automatically.
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="cards">

          <div className="card">
            <div className="card-icon">📍</div>
            <h3>GPS Tracking</h3>
            <p>
              Record the location of detected potholes for accurate
              road maintenance.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🤖</div>
            <h3>AI Detection</h3>
            <p>
              YOLO-based computer vision identifies potholes from
              road images.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">⚠️</div>
            <h3>Severity Assessment</h3>
            <p>
              Analyze road damage and identify areas requiring
              immediate attention.
            </p>
          </div>

        </div>

        {/* DETECTION */}
        <section className="upload-section" id="detection">

          <h2>Analyze Road Image</h2>

          <p>
            Upload a road image and let the AI system identify
            potholes and assess their severity.
          </p>

          <div className="upload-box">

            <div className="upload-icon">📷</div>

            <h3>Upload Road Image</h3>

            <p>
              Select a JPG, JPEG or PNG image
            </p>

            <label className="primary-btn">
              Choose Image
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageChange}
                hidden
              />
            </label>

            {preview && (
              <div className="preview">
                <img src={preview} alt="Road preview" />
              </div>
            )}

            {!preview && (
              <p>No image selected</p>
            )}

            <button
              className="primary-btn"
              onClick={handleDetect}
              disabled={!image}
            >
              Detect Potholes →
            </button>

          </div>

          {/* RESULTS */}
          {result && (
            <div className="results">

              <div className="result-card">
                <div className="result-label">
                  Potholes Detected
                </div>

                <div className="result-value">
                  {result.potholes}
                </div>
              </div>

              <div className="result-card">
                <div className="result-label">
                  Severity
                </div>

                <div className="result-value">
                  {result.severity}
                </div>
              </div>

              <div className="result-card">
                <div className="result-label">
                  AI Confidence
                </div>

                <div className="result-value">
                  {result.confidence}
                </div>
              </div>

            </div>
          )}

        </section>

        {/* HISTORY */}
        <section className="upload-section" id="history">

          <h2>Detection History</h2>

          <p>
            Previously detected road damage and inspection records
            will appear here.
          </p>

          <div className="card">
            <div className="card-icon">📊</div>
            <h3>Inspection Records</h3>
            <p>
              No previous inspections available.
            </p>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          PotholeAI — AI-powered road infrastructure monitoring
        </p>
      </footer>

    </div>
  );
}

export default App;