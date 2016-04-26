#!/usr/bin/env ruby

# Source images are highest resolution for that aspect ratio
LANDSCAPE_SOURCE = 'landscape_2208x1242.png'
PORTRAIT_SOURCE = 'portrait_1242x2208.png'

# TODO: fill out this hash
IOS_SPLASH_SIZES = {
  '4.7' => { width: 750, height: 1334 },
  '4' => { width: 640, height: 1136 },
  '3.5' => { width: 640, height: 960 }
}

ANDROID_SPLASH_SIZES = {
  'splash-land-ldpi.png' => { width: 320, height: 200 },
  'splash-land-mdpi.png' => { width: 480, height: 320 },
  'splash-land-hdpi.png' => { width: 800, height: 480 },
  'splash-land-xhdpi.png' => { width: 1280, height: 720 },
  'splash-land-xxhdpi.png' => { width: 1600, height: 960 },
  'splash-land-xxxhdpi.png' => { width: 1920, height: 1280 },
  'splash-port-ldpi.png' => { width: 200, height: 320 },
  'splash-port-mdpi.png' => { width: 320, height: 480 },
  'splash-port-hdpi.png' => { width: 480, height: 800 },
  'splash-port-xhdpi.png' => { width: 720, height: 1280 },
  'splash-port-xxhdpi.png' => { width: 960, height: 1600 },
  'splash-port-xxxhdpi.png' => { width: 1280, height: 1920 }
}

ANDROID_SPLASH_SIZES.each do |filename, dimensions|
  expanded_dimensions = "#{dimensions[:width]}x#{dimensions[:height]}"
  source_image = if filename.include?('port')
    PORTRAIT_SOURCE
  else
    LANDSCAPE_SOURCE
  end

  puts "generating 'android/#{filename}'"
  `convert #{source_image} -resize #{expanded_dimensions}^ -gravity center -extent #{expanded_dimensions} android/#{filename}`
end
