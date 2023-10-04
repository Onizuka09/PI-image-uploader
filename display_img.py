import subprocess 
import time
feh_command = ['feh','image.png']
feh_process = subprocess.Popen(feh_command)
print(feh_process.pid)
time.sleep(1)
feh_process.terminate()