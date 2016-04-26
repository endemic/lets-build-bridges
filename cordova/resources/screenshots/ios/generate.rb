#!/usr/bin/env ruby

# Source images are highest resolution for that aspect ratio
# This necessitates actually taking screenshots using an iPad Pro and iPhone 6+
IPAD_SOURCE_DIR = 'ipad_pro'
IPHONE_SOURCE_DIR = '5.5'

IOS_SCREENSHOT_SIZES = {
  '4.7' => {
    width: 750,
    height: 1334
  },
  '4' => {
    width: 640,
    height: 1136
  },
  '3.5' => {
    width: 540, # will need to add back in width for these shots
    height: 960
  },
  'ipad' => {
    width: 1536,
    height: 2048
  }
}

IOS_SCREENSHOT_SIZES.each do |directory, dimensions|
  Dir.mkdir(directory) unless Dir.exists?(directory)

  expanded_dimensions = "#{dimensions[:width]}x#{dimensions[:height]}"
  source_directory = if directory.include?('ipad')
    IPAD_SOURCE_DIR
  else
    IPHONE_SOURCE_DIR
  end

  Dir.glob("#{source_directory}/*.png").each_with_index do |filename, index|
    puts "Generating #{directory}/#{index + 1}.png"
    `convert #{filename} -resize #{expanded_dimensions}\! #{directory}/#{index + 1}.png`
  end
end

# Perhaps try this for resizing screenshots?
# convert -define jpeg:size=200x200 hatching_orig.jpg -thumbnail '100x100>' \
#           -background white -gravity center -extent 100x100 pad_extent.gif

# More info:
# http://www.imagemagick.org/Usage/thumbnails/#fit_summery
