#!/usr/bin/env ruby

# Source images are highest resolution for that aspect ratio
IPAD_SOURCE_DIR = 'ipad_pro'
IPHONE_SOURCE_DIR = '5.5'

IPHONES = {
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
  }
}

IPADS = {
  'ipad' => {
    width: 1536,
    height: 2048
  }
}

IPHONES.each do |directory, dimensions|
  Dir.mkdir(directory) unless Dir.exists?(directory)
  Dir.glob("#{IPHONE_SOURCE_DIR}/*.png").each_with_index do |filename, index|
    puts "Converting #{filename} into #{directory}"
    `convert #{filename} -resize #{dimensions[:width]}x#{dimensions[:height]}\! #{directory}/#{index + 1}.png`
  end
end

IPADS.each do |directory, dimensions|
  Dir.mkdir(directory) unless Dir.exists?(directory)
  Dir.glob("#{IPAD_SOURCE_DIR}/*.png").each_with_index do |filename, index|
    puts "Converting #{filename} into #{directory}"
    `convert #{filename} -resize #{dimensions[:width]}x#{dimensions[:height]}\! #{directory}/#{index + 1}.png`
  end
end
