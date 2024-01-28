#!/bin/bash



app="webserver.py"
venv_dir="my_venv"
service_file="aa"

setup_venv(){
echo "Creating a virtual environment: $venv_dir"
# Create virtual environment and install requirements
python3 -m venv "$venv_dir"
echo "A virtual environment $venv_dir has been set up in $(pwd)"
echo "Activating the virtual environment"
source "$venv_dir/bin/activate" || { echo "Error: Unable to activate virtual environment"; exit 1; }
#
# Verify if virtual environment is active
if [ "$VIRTUAL_ENV" != "" ]; then
    echo "Virtual environment is active"
    echo "Installing python packages required for the application"
    pip3 install -r requirements.txt
    echo "Finished installing"
else
    echo "Error: Virtual environment is not active"
    exit 1
fi
# Your further commands related to the virtual environment go here
# Deactivate virtual environment when done
#deactivate
echo "Virtual environment deactivated"
}


## update files variables

# updating the python file 
update_pythonprog(){
json_file="settings.json"

feh_cmd="['$(jq -r '.commands_path.feh' $json_file )','$(jq -r '.args_commands.feh_args.agr1' $json_file )' , '$(jq -r '.args_commands.feh_args.agr2' $json_file )','']"

DF_cmd="['$(jq -r '.commands_path.cmatrix' $json_file )','$(jq -r '.args_commands.cmatrix_agrs.agr1' $json_file )']"


# ip_address=$(jq -r '.server_settings.ip_address' $json_file )

bind_address="$(jq -r '.server_settings.bind_address' $json_file ):$(jq -r '.server_settings.port' $json_file )"

key="$(jq -r '.Flask_secret_key' $json_file )"


echo $DF_cmd
echo $ip_address
echo $bind_address
echo $key

# Escape forward slashes in DF_cmd and feh_cmd
escaped_DF_cmd=$(echo "$DF_cmd" | sed 's/\//\\\//g')
escaped_feh_cmd=$(echo "$feh_cmd" | sed 's/\//\\\//g')

# Update the value of KEY
sed -i "s/KEY='.*'/KEY='$key'/" "$app"

# Update the value of DF_CMD
# sed -i "s/DF_CMD=\[.*\]/DF_CMD=$escaped_DF_cmd/" "$app"

# Update the value of FEH_CMD
sed -i "s/FEH_CMD=\[.*\]/FEH_CMD=$escaped_feh_cmd/" "$app"

# Update the value of bind_address
sed -i "s/bind_adress='.*'/bind_adress='$bind_address'/" "$app"
}


## 
create_service_file(){

read -p "enter service file name ((filename.service): " service_file
# create a service file 
service_file="$service_file"

echo "creating a service file: $service_file"

touch $service_file

echo "[Unit]" > "$service_file"
echo "Description=A service that launches flask backend using guinicorn" >> "$service_file"
echo "After=multi-user.target" >> "$service_file"
echo "" >> "$service_file"

echo "[Service]" >> "$service_file"
echo "WorkingDirectory=$(pwd)" >> "$service_file"
echo "Environment=PATH=$(pwd)/$venv_dir/bin:"\$""PATH"" >> "$service_file"
echo "Environment=VIRTUAL_ENV=$(pwd)/$venv_dir" >> "$service_file"
echo "Environment=DISPLAY=:0" >> "$service_file"
echo "Environment=HOME=/home/$(whoami)" >> "$service_file"
echo "ExecStart=/bin/sh -c 'cd $(pwd)/ && . $venv_dir/bin/activate && python3 webserver.py'" >> "$service_file"
echo "Restart=always" >> $service_file
echo "" >> "$service_file"

echo "[Install]" >> "$service_file"
echo "WantedBy=multi-user.target" >> "$service_file"

echo "fincished creating"

cat $service_file
}

set_service(){
echo "moving $service_file to /etc/systemd/system/"
# move service file /etc 
sudo cp $service_file /etc/systemd/system/ 

# reload systemd 

# start an enable the srvice 
sudo systemctl start $service_file
sudo systemctl enable $service_file
# echo " to vew the stat
}

# change el fornted in .js file, (ip_adress, port ... ) 


# move the frontned and the uploads foldr to (/var/www/....)
setup_jsfile(){
js_file="./templates/upload.js"
read -p "set ip adress as localhost (y/n): " input
ip_address="127.0.0.1"
if [[ $input == "n" ]]; then
    # ip_address=$(ip route | awk 'NR==1 {print $3}');
    ip_address=$(hostname -I | awk 'NR==1 {print $2}')
    if [[ -z "$ip_address" ]]; then 
        echo "unable to retrieve a viable ip adress";
        echo "run ifconfig and check ip adress under wlan0";
        read -p "your IP adress please: " ip_address;
        ip_address="$ip_address" ;
        fi
    echo "Using IP address: $ip_address";
fi

sed -i "s/ip=\".*\"/ip=\"$ip_address\"/" "$js_file"
echo "transfering the templates folder .. ";
sudo cp -r templates/* /var/www/html
}
install_dependencisies(){
    sudo  apt update 
    sudo apt install appache2 cmatrix feh jq
}

install_dependencisies
setup_venv
update_pythonprog
setup_jsfile
create_service_file 
set_service
 
echo "The server is setup"
echo "you can connect via http://$ip_address"