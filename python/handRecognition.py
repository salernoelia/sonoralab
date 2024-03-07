# Import Libraries
import cv2
import time
import mediapipe as mp
import websocket
import json
# Create a WebSocket connection
ws = websocket.WebSocket()

# Connect to the WebSocket server
ws.connect("ws://localhost:8081")

# Grabbing the Hand Model from Mediapipe and
# Initializing the Model
mp_hands = mp.solutions.hands
hands_model = mp_hands.Hands(
    static_image_mode=False, 
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Initializing the drawing utils for drawing the hand landmarks on image
mp_drawing = mp.solutions.drawing_utils


# ----------------------------------------------------- 
# Video Capture -> 0 is often Webcam, 
# to find other camera run python3.11 python/findcam.py
# -----------------------------------------------------

capture = cv2.VideoCapture(0)
#capture = cv2.VideoCapture(2)


capture.set(cv2.CAP_PROP_FRAME_WIDTH, 160*3)
capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 90*3)


# Initializing current time and precious time for calculating the FPS
previousTime = 0
currentTime = 0

while capture.isOpened():
    # capture frame by frame
    ret, frame = capture.read()

    # Converting the from BGR to RGB
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Making predictions using hands model
    image.flags.writeable = False
    results = hands_model.process(image)
    image.flags.writeable = True

    # Converting back the RGB image to BGR
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Code to access landmarks
    if results.multi_hand_landmarks:
        for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
            handedness = results.multi_handedness[idx].classification[0].label
            for id, lm in enumerate(hand_landmarks.landmark):
                if id == 8 or id == 4:  # index finger tip or thumb tip
                    landmark_data = {
                        'hand': f'{handedness.lower()}-{ "index" if id == 8 else "thumb"}',
                        'x': lm.x,
                        'y': lm.y,
                        'z': lm.z,
                    }
                    ws.send(json.dumps(landmark_data))

            mp_drawing.draw_landmarks(
                image, 
                hand_landmarks, 
                mp_hands.HAND_CONNECTIONS
            )

    # fps calculation
    currentTime = time.time()
    fps = 1 / (currentTime - previousTime)
    previousTime = currentTime

    # Displaying FPS on the image
    cv2.putText(image, str(int(fps)) + " FPS", (10, 70), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)

    # Display the resulting image
    cv2.imshow("Hand Landmarks", image)

    # Enter key 'q' to break the loop
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

capture.release()
cv2.destroyAllWindows()
ws.close()
