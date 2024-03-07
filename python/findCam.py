import cv2

# Try the indices from 0 to 10
for i in range(10):
    try:
        # Try to create a VideoCapture object
        capture = cv2.VideoCapture(i)
        if capture is None or not capture.isOpened():
            print('Unable to open video source:', i)
        else:
            print('Found video source:', i)
            ret, frame = capture.read()
            if ret:
                cv2.imshow("Camera " + str(i), frame)
    except:
        print('Error occurred while trying to open video source:', i)

# Wait for a key press and then close all windows
cv2.waitKey(0)
cv2.destroyAllWindows()

# Release all captures
for i in range(10):
    try:
        capture = cv2.VideoCapture(i)
        if capture is not None and capture.isOpened():
            capture.release()
    except:
        continue
