#!/usr/bin/python

import time
from time import strftime, gmtime
from Adafruit_LED_Backpack import SevenSegment
import urllib2
import json

DIGIT_VALUES = {
    ' ': 0x00,
    '-': 0x40,
    '0': 0x3F,
    '1': 0x06,
    '2': 0x5B,
    '3': 0x4F,
    '4': 0x66,
    '5': 0x6D,
    '6': 0x7D,
    '7': 0x07,
    '8': 0x7F,
    '9': 0x6F,
    'A': 0x77,
    'B': 0x7C,
    'C': 0x39,
    'D': 0x5E,
    'E': 0x79,
    'F': 0x71
}

def loading():
	panel = 1
	display.clear()

	for y in range(0, 16):
		for x in range(0,4):
			display.set_digit_raw(x, panel)
		try: 
			display.write_display()
		except:
			print "Write error"
			pass

		panel = panel * 2
		if panel > 32:
			panel = 1

		time.sleep(0.05)
	
def clock():
	display.clear()
	colon = True
	for x in range(0,10):
		display.set_colon(colon)
		t = float(strftime("%I.%M"))
		display.print_float(t)
		try: 
			display.write_display()
		except:
			print "Write error"
			pass

		colon = not colon
		time.sleep(1)

def weather():
	display.clear()
	loop = True
	try:
		response = urllib2.urlopen('http://api.openweathermap.org/data/2.5/weather?q=Wollongong,AU&appid=5b0bf755ef773f2a284183cfee4aa540&units=metric')
		data = json.load(response)
		t = str(data['main']['temp'])

		for x in range (0, 5):
			display.set_digit_raw(0, DIGIT_VALUES.get(str(t[0]).upper(), 0x00))
			display.set_digit_raw(1, DIGIT_VALUES.get(str(t[1]).upper(), 0x00))
			display.set_digit_raw(2, 0x63)
			display.set_digit_raw(3, 0x39)
			try: 
				display.write_display()
			except:
				print "Write error"
				pass
			time.sleep(1)
	except:
		print "URL error"
		pass

display = SevenSegment.SevenSegment()
display.begin()

loading()
while True:
	clock()
	weather()
