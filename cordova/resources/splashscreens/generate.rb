#!/usr/bin/env ruby

# Source images are highest resolution for that aspect ratio
LANDSCAPE_SOURCE = 'landscape_2208x1242.png'
PORTRAIT_SOURCE = 'portrait_1242x2208.png'

IOS_SPLASH_SIZES = {
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

ANDROID_SPLASH_SIZES = {

}

=begin
        <splash src="resources/splashscreens/android/splash-land-hdpi.png" density="land-hdpi"/>
        <splash src="resources/splashscreens/android/splash-land-ldpi.png" density="land-ldpi"/>
        <splash src="resources/splashscreens/android/splash-land-mdpi.png" density="land-mdpi"/>
        <splash src="resources/splashscreens/android/splash-land-xhdpi.png" density="land-xhdpi"/>

        <splash src="resources/splashscreens/android/splash-port-hdpi.png" density="port-hdpi"/>
        <splash src="resources/splashscreens/android/splash-port-ldpi.png" density="port-ldpi"/>
        <splash src="resources/splashscreens/android/splash-port-mdpi.png" density="port-mdpi"/>
        <splash src="resources/splashscreens/android/splash-port-xhdpi.png" density="port-xhdpi"/>
=end

IPADS.each do |directory, dimensions|
  Dir.mkdir(directory) unless Dir.exists?(directory)
  Dir.glob("#{IPAD_SOURCE_DIR}/*.png").each_with_index do |filename, index|
    puts "Converting #{filename} into #{directory}"
    `convert #{filename} -resize #{dimensions[:width]}x#{dimensions[:height]}\! #{directory}/#{index + 1}.png`
  end
end
