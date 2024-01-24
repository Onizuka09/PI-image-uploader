#!/usr/bin/sh
#

pi_ID=$(ip route | awk 'NR==1 {print $3}')

echo $pi_ID
# . venv/bin/activate
# python3 webserver.py 


