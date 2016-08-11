#!/bin/bash

export LD_LIBRARY_PATH=/usr/lib/vlc
export VLC_PLUGIN_PATH=/usr/lib/vlc/plugins
export M2_HOME=/opt/apache-maven-3.3.9
export PATH=$PATH:/$M2_HOME/bin
export DISPLAY=:1

cd /home/pi/nicksclock/ && python clock.py&
cd /home/pi/Desktop/alexa-avs-raspberry-pi-master/samples/javaclient && /opt/apache-maven-3.3.9/bin/mvn exec:exec 
