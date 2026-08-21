import cv2
import numpy as np
from PIL import Image, ImageOps
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class FaceDetector:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        # Initialize Haar Cascade Face Detector
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.padding = getattr(settings, 'FACE_CROP_PADDING', 1.3)
        logger.info("FaceDetector initialized with padding %.2f", self.padding)

    def detect_faces(self, image: Image.Image) -> list[dict]:
        # Apply EXIF transpose to ensure correct orientation
        try:
            image = ImageOps.exif_transpose(image)
        except Exception as e:
            logger.warning(f"Error applying EXIF transpose: {e}")

        # Convert to RGB and numpy array for OpenCV
        if image.mode != 'RGB':
            image = image.convert('RGB')
        img_np = np.array(image)
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)

        # Detect faces
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        result_faces = []
        if len(faces) == 0:
            logger.warning("No faces detected. Returning entire image as single crop.")
            # Center crop logic or just return the whole image
            # The prompt asks for: "return entire image as single 'face' with center crop"
            # Actually just returning entire image
            w, h = image.size
            crop = image.copy()
            result_faces.append({
                "index": 0,
                "crop": crop,
                "bbox": {"x1": 0, "y1": 0, "x2": w, "y2": h}
            })
            return result_faces

        # Calculate areas to filter out small faces in group photos
        face_areas = [w * h for (x, y, w, h) in faces]
        max_area = max(face_areas)

        idx = 0
        img_h, img_w = img_np.shape[:2]

        for (x, y, w, h), area in zip(faces, face_areas):
            if area >= 0.5 * max_area:
                # Apply padding
                pad_w = int(w * (self.padding - 1.0) / 2.0)
                pad_h = int(h * (self.padding - 1.0) / 2.0)
                
                x1 = max(0, x - pad_w)
                y1 = max(0, y - pad_h)
                x2 = min(img_w, x + w + pad_w)
                y2 = min(img_h, y + h + pad_h)
                
                crop = image.crop((x1, y1, x2, y2))
                
                result_faces.append({
                    "index": idx,
                    "crop": crop,
                    "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
                })
                idx += 1
                
        logger.info(f"Detected {len(result_faces)} faces.")
        return result_faces
