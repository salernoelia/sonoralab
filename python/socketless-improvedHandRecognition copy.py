# Import Libraries
import cv2
import time
import mediapipe as mp
import websocket

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

with mp_hands.Hands ( 
    min_detection_confidence = 0.5,
    min_tracking_confidence = 0.5) as hands:
    
    while cap.isOpened():
            success, image = cap.read()
            if not success:
                print("Ignoring empty camera frame.")
                continue
            start = time.time()
            
            image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
            
            image.flags.writeable = False
            
            results = hands.process(image)
            
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
            
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    # Print out the label of the hand.
                    print(f'Handedness: {results.multi_handedness}')

                    mp_drawing.draw_landmarks(
                        image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                    print(hand_landmarks)
                    
                    
            
            
            
            end = time.time()
            totalTime = end - start
            fps = 1 / totalTime
            cv2.putText(image, f'FPS: {int(fps)}', (40, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
            cv2.imshow('Hand Tracking', image)
            print(fps)


cap.release()
