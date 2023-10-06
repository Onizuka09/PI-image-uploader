from flask import Flask, jsonify, render_template, request, flash, redirect, url_for
import os
import subprocess
from flask_cors import CORS
UPLOAD_FOLDER = 'uploads'
app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'moktar'
feh_command = ['feh', '--zoom 100', '-F', '']
feh_process = subprocess.Popen(feh_command, shell=True)

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
            feh_process.terminate()
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            if (feh_process):
                feh_process.terminate()
            feh_command[3] = path
            feh_process = subprocess.Popen(feh_command, shell=True)
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
    if request.method == 'POST':
        data = request.get_json()
        selected_images = data["SelectedImages"][0]
        print(selected_images)
        path = os.path.join(app.config['UPLOAD_FOLDER'], selected_images)
        if (feh_process):
            feh_process.terminate()
        feh_command[3] = path
        feh_process = subprocess.Popen(feh_command, shell=True)
        print("uploaded successfuly")
        return jsonify({"message": "Selected images received and processed"}), 200
    return jsonify({"message": "Invalid request"}), 400


if __name__ == '__main__':
  #  sio.run(app,host='0.0.0.0',debug=True)
    app.run(host='0.0.0.0')
