from flask import Flask, jsonify, render_template, request, flash, redirect, url_for
import os
from apscheduler.schedulers.background import BackgroundScheduler
import subprocess
from flask_cors import CORS
UPLOAD_FOLDER = 'uploads'
app = Flask(__name__)
CORS(app)


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'moktar'
default_command = ['hollywood','--zoom100','-F','']
default_process = subprocess.Popen(default_command, shell =True)
feh_command = ['feh', '--zoom 100', '-F', '']
feh_process = subprocess.Popen(feh_command, shell=True)
scheduler = BackgroundScheduler()

# Upload an image


@app.route('/upload', methods=['POST'])
def upload():
    global feh_process
    # checks for request method
    if request.method == "POST":
        # Check if a file was uploaded
        if 'fileInput' not in request.files:
            return jsonify({"message": "No file part"}), 400

        file = request.files['fileInput']
        # check if the filename is valid
        if file.name == '':
            return jsonify({"message": "No selected file"}), 400
        # start the upload
        if file:
            filename = file.filename
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            print("uploaded successfuly")
            return jsonify({"message": "File uploaded successfully"}), 200
    return jsonify({"message": "Invalid request"}), 400

# Function to get a list of all image files in the UPLOAD_FOLDER


def get_all_images():
    image_files = []
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            image_files.append(filename)
    return image_files
# get all images


@app.route('/getAllImages', methods=['GET'])
def getAllImages():
    if request.method == 'GET':
        images = get_all_images()
        return jsonify({"images": images}), 200
    return jsonify({"message": "Invalid request"}), 400

# Display Seleceted image


@app.route('/displayImage', methods=['POST'])
def displayImage():
    global feh_process
    if request.method == 'POST':
        data = request.get_json()
        selected_images = data["SelectedImages"]
        if not selected_images:
            return jsonify({"message": "No selected images"}), 400
        print(len(selected_images))
        if len(selected_images) == 1:
            if scheduler and scheduler.running:
                stopImageSwitching()
            path = os.path.join(
                app.config['UPLOAD_FOLDER'], selected_images[0])
            if (feh_process):
                feh_process.terminate()
            feh_command[3] = path
            feh_process = subprocess.Popen(feh_command, shell=True)
            print("displayed single image successfuly")
            return jsonify({"message": "Selected Image Displayed"}), 200
        else:
            scheduler.resume()
            scheduler.add_job(ImageSwitcher, 'interval',
                              args=(selected_images,), seconds=10)
            return jsonify({"message": "Selected images received and processed"}), 200
    return jsonify({"message": "Invalid request"}), 400

@app.route('/deleteImage', methods=['POST'])
def deleteImae():
    if request.method == 'POST':
        data = request.get_json()
        selected_images = data["SelectedImages"]
        print(selected_images);
        if not selected_images:
            return jsonify({"message": "No selected images"}), 400
        for i in range(len(selected_images)):
            filename = selected_images[i]
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            os.remove(path)
        print("displayed single image successfuly")
        return jsonify({"message": "Selected Image Displayed"}), 200
    return jsonify({"message": "Invalid request"}), 400


def ImageSwitcher(selectedImages):
    global feh_process
    path = os.path.join(app.config['UPLOAD_FOLDER'], selectedImages[0])
    if (feh_process):
        feh_process.terminate()
    feh_command[3] = path
    feh_process = subprocess.Popen(feh_command, shell=True)
    element = selectedImages.pop(0)
    selectedImages.append(element)
    print("image switched")


@app.route('/stopImageSwitching', methods=['POST'])
def stopImageSwitching():
    global scheduler
    if scheduler and scheduler.running:
        scheduler.pause()
        print("Image switching stopped")
        return jsonify({"message": "Image switching stopped"}), 200
    else:
        return jsonify({"message": "Image switching is not active"}), 400


if __name__ == '__main__':
    #  sio.run(app,host='0.0.0.0',debug=True)
    scheduler.start()
    app.run(host='0.0.0.0')
