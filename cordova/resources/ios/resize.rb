#!/usr/bin/env ruby

SOURCE_IMAGE = 'iTunesArtwork@2x.png'

SIZES = {
  40 => 'Icon-40.png',
  80 => 'Icon-40@2x.png',
  50 => 'Icon-50.png',
  100 => 'Icon-50@2x.png',
  60 => 'Icon-60.png',
  120 => 'Icon-60@2x.png',
  180 => 'Icon-60@3x.png',
  114 => 'Icon@2x.png',
  72 => 'Icon-72.png',
  144 => 'Icon-72@2x.png',
  76 => 'Icon-76.png',
  152 => 'Icon-76@2x.png',
  29 => 'Icon-Small.png',
  58 => 'Icon-Small@2x.png',
  87 => 'Icon-Small@3x.png',
  512 => 'iTunesArtwork.png'
}

SIZES.each do |dimension, filename|
  `convert #{SOURCE_IMAGE} -resize #{dimension}x#{dimension} #{filename}`
end
