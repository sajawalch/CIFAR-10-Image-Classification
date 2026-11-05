
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np

from PIL import Image
import io


# 1. Create FastAPI application

app = FastAPI(
    title="CIFAR-10 Image Classification API",
    description="Image classification using CNN",
    version="1.0"
)

# Enable CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. CIFAR-10 class names

class_names = [
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
]


# 3. Load trained model

model = tf.keras.models.load_model(
    "cifar10_cnn_model.keras"
)

print("CNN Model Loaded Successfully!")


# 4. Home route

@app.get("/")
def home():

    return {
        "message": "Welcome to CIFAR-10 Image Classification API",
        "status": "Running Successfully"
    }


# 5. Image preprocessing

def preprocess_image(image):

    image = image.convert("RGB")

    image = image.resize((32, 32))

    image_array = np.array(image)

    image_array = image_array.astype("float32")

    image_array = image_array / 255.0

    image_array = np.expand_dims(image_array, axis=0)

    return image_array


# 6. Prediction endpoint

@app.post("/predict")
def predict(file: UploadFile = File(...)):

    try:

        image_data = file.file.read()

        image = Image.open(io.BytesIO(image_data))

        processed_image = preprocess_image(image)

        predictions = model.predict(
            processed_image,
            verbose=0
        )

        predicted_class = int(
            np.argmax(predictions[0])
        )

        predicted_label = class_names[predicted_class]

        confidence = float(
            predictions[0][predicted_class] * 100
        )

        return {

            "filename": file.filename,

            "predicted_class": predicted_label,

            "confidence": round(confidence, 2)

        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Image prediction failed: {str(e)}"
        )

    finally:

        file.file.close()
