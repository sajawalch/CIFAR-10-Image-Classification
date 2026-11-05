
import { useState } from "react";

import {
  Upload,
  Image as ImageIcon,
  Brain,
  Sparkles,
  Loader2,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import "./App.css";


const API_URL = "http://127.0.0.1:8000";


const categories = [
  "Airplane",
  "Automobile",
  "Bird",
  "Cat",
  "Deer",
  "Dog",
  "Frog",
  "Horse",
  "Ship",
  "Truck"
];


function App() {

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(null);

  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // Handle image selection

  const handleImageChange = (event) => {

    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

      setError("Please select a valid image.");

      return;

    }

    setImage(file);

    setPreview(URL.createObjectURL(file));

    setPrediction(null);

    setError("");

  };


  // Send image to FastAPI

  const handlePredict = async () => {

    if (!image) {

      setError("Please upload an image first.");

      return;

    }

    setLoading(true);

    setError("");

    setPrediction(null);


    const formData = new FormData();

    formData.append("file", image);


    try {

      const response = await fetch(
        `${API_URL}/predict`,
        {
          method: "POST",
          body: formData
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail || "Prediction failed."
        );

      }


      setPrediction(data);

    }

    catch (err) {

      setError(
        err.message || "Unable to connect to the backend."
      );

    }

    finally {

      setLoading(false);

    }

  };


  // Reset application

  const handleReset = () => {

    setImage(null);

    setPreview(null);

    setPrediction(null);

    setError("");

  };


  return (

    <div className="app">

      {/* Navigation */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <Brain size={25} />
          </div>

          <span>VisionAI</span>

        </div>


        <div className="model-status">

          <span className="status-dot"></span>

          CNN Model Active

        </div>

      </nav>


      {/* Main Content */}

      <main className="main-container">

        <section className="hero">

          <div className="tag">
            <Sparkles size={15} />
            AI POWERED CLASSIFICATION
          </div>


          <h1>
            Image Classification
            <span> Made Intelligent.</span>
          </h1>


          <p>
            Upload an image and let our CNN model
            identify objects using artificial intelligence.
          </p>

        </section>


        <section className="workspace">

          {/* Upload Card */}

          <div className="upload-card">

            <div className="section-heading">

              <h2>Upload Image</h2>

              <span>STEP 01</span>

            </div>


            <label className="upload-area">

              {preview ? (

                <img
                  src={preview}
                  alt="Uploaded preview"
                  className="preview-image"
                />

              ) : (

                <div className="upload-placeholder">

                  <div className="upload-icon">
                    <Upload size={30} />
                  </div>

                  <h3>Drop your image here</h3>

                  <p>or click to browse your computer</p>

                  <span>PNG, JPG, JPEG</span>

                </div>

              )}


              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageChange}
                hidden
              />

            </label>


            {image && (

              <div className="selected-file">

                <ImageIcon size={18} />

                <span>{image.name}</span>

                <CheckCircle2 size={18} color="#16a36a" />

              </div>

            )}


            <button
              className="predict-button"
              onClick={handlePredict}
              disabled={!image || loading}
            >

              {loading ? (

                <>
                  <Loader2 className="spin" size={19} />
                  Analyzing Image...
                </>

              ) : (

                <>
                  <Sparkles size={19} />
                  Predict Image
                </>

              )}

            </button>


            {error && (

              <div className="error-message">

                <AlertCircle size={18} />

                {error}

              </div>

            )}

          </div>


          {/* Result Card */}

          <div className="result-card">

            <div className="section-heading">

              <h2>Prediction Result</h2>

              <span>STEP 02</span>

            </div>


            {!prediction && !loading && (

              <div className="empty-result">

                <div className="result-icon">
                  <Brain size={42} />
                </div>

                <h3>Waiting for prediction</h3>

                <p>
                  Upload an image and click the
                  Predict Image button to see results.
                </p>

              </div>

            )}


            {loading && (

              <div className="empty-result">

                <Loader2 className="spin" size={45} />

                <h3>Analyzing your image</h3>

                <p>Our CNN model is making a prediction...</p>

              </div>

            )}


            {prediction && (

              <div className="prediction-content">

                <div className="success-icon">
                  <CheckCircle2 size={25} />
                </div>

                <span className="result-label">
                  IDENTIFIED OBJECT
                </span>


                <h1>{prediction.predicted_class}</h1>


                <div className="confidence-heading">

                  <span>Confidence Score</span>

                  <strong>
                    {prediction.confidence}%
                  </strong>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${prediction.confidence}%`
                    }}
                  ></div>

                </div>


                <p className="result-description">
                  Your image has been successfully
                  classified by our CNN model.
                </p>


                <button
                  className="reset-button"
                  onClick={handleReset}
                >

                  <RotateCcw size={17} />

                  Try Another Image

                </button>

              </div>

            )}

          </div>

        </section>


        {/* CIFAR-10 Categories */}

        <section className="categories-section">

          <h2>10 Categories Our Model Recognizes</h2>

          <div className="categories-grid">

            {categories.map((category) => (

              <div
                className="category-item"
                key={category}
              >

                <CheckCircle2 size={16} />

                {category}

              </div>

            ))}

          </div>

        </section>


        <footer>

          Built with React, FastAPI and TensorFlow

        </footer>

      </main>

    </div>

  );

}


export default App;
