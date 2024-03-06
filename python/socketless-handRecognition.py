# Import Libraries
import cv2
import time
import mediapipe as mp
# import websocket
import json

# Create a WebSocket connection
# ws = websocket.WebSocket()

# Create event handlers
# def on_message(ws, message):
#     print(message)

# def on_error(ws, error):
#     print(error)

# def on_close(ws):
#     print("### closed ###")

# def on_open(ws):
#     print("Opened connection")

# Assign event handlers to WebSocket instance
# ws.on_message = on_message
# ws.on_error = on_error
# ws.on_close = on_close
# ws.on_open = on_open

# # Connect to the WebSocket server
# ws.connect("ws://localhost:8081")

# Grabbing the Holistic Model from Mediapipe and
# Initializing the Model
mp_holistic = mp.solutions.holistic
holistic_model = mp_holistic.Holistic(
    static_image_mode=False, 
    model_complexity=1, 
    smooth_landmarks=True, 
    min_detection_confidence=0.4,
    min_tracking_confidence=0.4
)

# Initializing the drawing utils for drawing the facial landmarks on image
mp_drawing = mp.solutions.drawing_utils

# (0) in VideoCapture is used to connect to your computer's default camera
capture = cv2.VideoCapture(0)

# Initializing current time and precious time for calculating the FPS
previousTime = 0
currentTime = 0

while capture.isOpened():
    # capture frame by frame
    ret, frame = capture.read()

    # resizing the frame for better view
    # frame = cv2.resize(frame, (800, 600))

    # Converting the from BGR to RGB
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Making predictions using holistic model
    # To improve performance, optionally mark the image as not writeable to
    # pass by reference.
    image.flags.writeable = False
    results = holistic_model.process(image)
    image.flags.writeable = True

    # Converting back the RGB image to BGR
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Code to access landmarks
    # if results.right_hand_landmarks:
    #     landmark_8 = results.right_hand_landmarks.landmark[8]
    #     landmark_data_index = {
    #         'hand': 'right-index',
    #         'x': landmark_8.x,
    #         'y': landmark_8.y,
    #         'z': landmark_8.z,
    #     }
    #     landmark_4 = results.right_hand_landmarks.landmark[4]
    #     landmark_data_thumb = {
    #         'hand': 'right-thumb',
    #         'x': landmark_4.x,
    #         'y': landmark_4.y,
    #         'z': landmark_4.z,
    #     }
        
        
        # print("Right Hand", landmark_data)
        # ws.send(json.dumps(landmark_data_index))
        # ws.send(json.dumps(landmark_data_thumb))
        
    if results.left_hand_landmarks:
        landmark_8 = results.left_hand_landmarks.landmark[8]
        landmark_data_index = {
            'hand': 'left-index',
            'x': landmark_8.x,
            'y': landmark_8.y,
            'z': landmark_8.z,
        }
        landmark_4 = results.left_hand_landmarks.landmark[4]
        landmark_data_thumb = {
            'hand': 'left-thumb',
            'x': landmark_4.x,
            'y': landmark_4.y,
            'z': landmark_4.z,
        }
        # print("Left Hand", landmark_data)
        # ws.send(json.dumps(landmark_data_index))
        # ws.send(json.dumps(landmark_data_thumb))
        

    # right hand
    # mp_drawing.draw_landmarks(
    #     image, 
    #     results.right_hand_landmarks, 
    #     mp_holistic.HAND_CONNECTIONS
    # )

    # # left hand
    # mp_drawing.draw_landmarks(
    #     image, 
    #     results.left_hand_landmarks, 
    #     mp_holistic.HAND_CONNECTIONS
    # )

    # fps calculation
    currentTime = time.time()
    fps = 1 / (currentTime - previousTime)
    previousTime = currentTime
    print(fps)

    # Displaying FPS on the image
    # cv2.putText(image, str(int(fps)) + " FPS", (10, 70), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)

    # Display the resulting image
    # cv2.imshow("Facial and Hand Landmarks", image)

    # Enter key 'q' to break the loop
    # if cv2.waitKey(5) & 0xFF == ord('q'):
    #     break

# When all the process is done
# Release the capture and destroy all windows
# ws.close()
capture.release()
cv2.destroyAllWindows()
