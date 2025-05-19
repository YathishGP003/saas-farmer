import sys
import json
import os
import numpy as np
from PIL import Image
import io
import base64
import pickle
import tensorflow as tf
import logging
# Suppress TensorFlow and Keras logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # FATAL
tf.get_logger().setLevel(logging.ERROR)

# Redirect stderr to prevent output mixing with our JSON
import contextlib
from datetime import datetime

# Create a context manager to temporarily redirect stdout and stderr
@contextlib.contextmanager
def capture_output():
    old_stdout, old_stderr = sys.stdout, sys.stderr
    try:
        # Redirect stderr to prevent TF/Keras messages from mixing with JSON output
        sys.stderr = open(os.devnull, 'w')
        yield
    finally:
        sys.stderr.close()
        sys.stderr = old_stderr
from keras.models import load_model as keras_load_model
from keras.preprocessing.image import img_to_array

# Path to the model file
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'crop_disease_detection.pkl')

def load_model():
    """Load the model from pickle file"""
    try:
        # Load the model from the pickle file - since it's a Keras model in pickle format
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        return model
    except Exception as e:
        print(json.dumps({'error': f'Failed to load model: {str(e)}'}))
        sys.exit(1)

def preprocess_image(image_bytes):
    """Preprocess the image for the Keras model"""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        # Resize to the expected input size for the model
        image = image.resize((224, 224))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array and normalize
        img_array = img_to_array(image)
        img_array = img_array / 255.0  # Scale pixel values to [0, 1]
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        print(json.dumps({'error': f'Failed to preprocess image: {str(e)}'}))
        sys.exit(1)

def predict(image_base64):
    """Make prediction using the loaded model"""
    try:
        # Validate base64 input
        try:
            image_bytes = base64.b64decode(image_base64)
        except Exception:
            print(json.dumps({'error': 'Invalid base64 image data. Please provide a properly encoded image.'}))
            sys.exit(1)
            
        # Load the model
        model = load_model()
        
        # Process the image
        try:
            processed_image = preprocess_image(image_bytes)
        except Exception as img_error:
            print(json.dumps({'error': f'Image processing failed: {str(img_error)}. Make sure you are providing a valid image.'}))
            sys.exit(1)
        
        # Make prediction using the Keras model - suppress output
        with capture_output():
            prediction = model.predict(processed_image, verbose=0)
        
        result = process_prediction_result(prediction)
        
        # Ensure only clean JSON is printed to stdout
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'error': f'Prediction failed: {str(e)}'}))
        sys.exit(1)

def process_prediction_result(prediction):
    """Process the raw prediction results into a more usable format"""
    
    predicted_class = int(np.argmax(prediction[0]))
    
    disease_classes = [
        'Healthy',
        'Apple Scab',
        'Black Rot',
        'Cedar Apple Rust',
        'Powdery Mildew',
    ]
    
    if 0 <= predicted_class < len(disease_classes):
        disease_name = disease_classes[predicted_class]
    else:
        disease_name = f'Unknown (Class {predicted_class})'
    
    confidence = float(prediction[0][predicted_class])
    
    return {
        'disease': disease_name,
        'confidence': confidence,
        'class_index': predicted_class,
        'date': datetime.now().isoformat()
    }

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Invalid arguments. Expected base64 encoded image.'}))
        sys.exit(1)
    
    image_base64 = sys.argv[1]
    predict(image_base64)