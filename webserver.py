from flask import Flask, render_template,request, flash, redirect, url_for
import os
import subprocess
UPLOAD_FOLDER = 'uploads'
app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'moktar'
feh_command = ['feh --zoom 100 -F','']
feh_process = subprocess.Popen(feh_command)
@app.route('/',methods=['GET', 'POST'])
def route():
    global feh_process
    if request.method == 'POST':
        # Check if a file was uploaded
        if 'Uploadimage' in request.files:
            file = request.files['Uploadimage']
            if file.filename != '':
                feh_process.terminate()
                path =os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                file.save(path)
                
                flash("File uploaded successfully.", 'success') 
                feh_command[1]=path
                # print(feh_command)
                feh_process = subprocess.Popen(feh_command)
                
                return redirect(url_for('route')) 
    return render_template('index.html')


if __name__ =='__main__':
  #  sio.run(app,host='0.0.0.0',debug=True)    
    app.run(host='0.0.0.0')