#!/usr/bin/python

import time
from time import strftime, gmtime
from Adafruit_LED_Backpack import SevenSegment

display = SevenSegment.SevenSegment()
display.begin()
colon = False
display.set_colon(colon)
display.clear()
#display.set_fixed_decimal(True)
display.set_left_colon(False)
display.write_display()
