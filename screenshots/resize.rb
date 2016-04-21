#!/usr/bin/env ruby

# Source images are highest resolution for that aspect ratio
IPAD_SOURCE_DIR = 'ipad_pro'
IPHONE_SOURCE_DIR = 'six_plus'

IPHONES = {
  'six' => {
    width: 750,
    height: 1334
  },
  'five' => {
    width: 640,
    height: 1136
  },
  'four' => {
    width: 540, # will need to add back in width for these shots
    height: 960
  }
}

IPADS = {
  'ipad_retina' => {
    width: 1536,
    height: 2048
  },
  'ipad_classic' => {
    width: 768,
    height: 1024
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
