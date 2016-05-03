#!/usr/bin/env ruby

SOURCE_IMAGE = 'icon_1024x1024.png'

IOS_ICON_SIZES = {
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
  512 => 'iTunesArtwork.png',
  1024 => 'iTunesArtwork@2x.png'
}

IOS_ICON_SIZES.each do |dimension, filename|
  puts "Generating ios/#{filename}"
  `convert #{SOURCE_IMAGE} -resize #{dimension}x#{dimension} ios/#{filename}`
end

ANDROID_ICON_SIZES = {
  36 => 'ldpi.png',
  48 => 'mdpi.png',
  72 => 'hdpi.png',
  96 => 'xhdpi.png',
  144 => 'xxhdpi.png',
  192 => 'xxxhdpi.png',
  512 => 'play_store.png'
}

ANDROID_ICON_SIZES.each do |dimension, filename|
  puts "Generating android/#{filename}"
  `convert #{SOURCE_IMAGE} -resize #{dimension}x#{dimension} android/#{filename}`
end
