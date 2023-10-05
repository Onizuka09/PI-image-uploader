from flask import Flask, jsonify, render_template, request, flash, redirect, url_for
import os
import subprocess
UPLOAD_FOLDER = 'uploads'
app = Flask(__name__)

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


if __name__ == '__main__':
  #  sio.run(app,host='0.0.0.0',debug=True)
    app.run(host='0.0.0.0')
