# TODO

## Android version

[ ] Configure AdMob plugin
[x] Add AdMob plugin code to show between puzzles
[x] Extract icon generation script to output web/iOS/Android icons
[x] Config Android icons
[x] Create splash screen generation script
[x] Config Android splash screens
[ ] Review Nag scene points to right Play Store link
[ ] About scene points to right Play Store links
[ ] Double-check all Cordova-specific conditional statements

--------------------

[ ] Auto save/restore puzzle progress
[ ] Add "win" jingle
[ ] Allow users to share levels?
[ ] Combine editor/game?
[ ] Maybe some music?

---------------------

[x] "About" screen with "rate", "reset data", and "more games" buttons
[x] New screenshots with descriptive text
	* Tap and drag to connect islands together
	* Connect all the islands to solve the puzzle
	* 100 unique puzzles to solve
	* Play on your phone or tablet
[x] Ditch gulp
[x] Upgrade to newest Cordova with fast webview
[x] Add "rate this app" nag view -- after completing half the puzzles
[x] Create new version in iTunes Connect
[x] Update icon in Cordova project
[x] Add back "destroyAll" to Arcadia.Pool - used to remove button event listeners
[x] Randomly cycle background colors
[x] Only draw "cursor" object when first touch hits a node
[x] Update level data to work with new version of Arcadia
[x] Display a "progress" bar when puzzle is solved: [==|-----------]
[x] Disassociate Sona w/ Arcadia -- no need to have them munged together, user can just create global Sona instance to handle music/sound
[x] Create/reference app icon (http://makeappicon.com/)
[x] Add splash screen images
[x] Add programming for IAP (https://github.com/Fovea/cordova-plugin-purchase-demo/blob/master/www/js/index.js)
[x] Test IAP on actual device
[x] Add code to show/hide splash screen (https://github.com/apache/cordova-plugin-splashscreen)
[x] Add screenshots for various devices
  [x] iPhone 4S
  [x] iPhone 5
  [x] iPhone 6
  [x] iPhone 6+
  [x] iPad (retina)
[x] Make index.html background purple
[x] Add SFX to button presses for IAP scene
[x] Create app in iTunesConnect
[x] Add an "unlock" button to LevelSelect - takes you to the upsell scene
[x] Upsell scene has "unlock", "restore", and "no, thanks" buttons
[x] Levels 16-100 have a red background when the game isn't unlocked
[x] Trying to play one will forward to the upsell scene
[x] When normal puzzle is completed, make a check that the first 15 puzzles are
    solved; if so, forward to upsell scene
[x] What happens when user clicks "Next" but don't have any unsolved puzzles left?
    Either because they only have 15 or have completed all 100?
[x] Sometimes Shape#draw will die in Bridges, throwing an InvalidStateError.
This seems to occur because the canvas cache of an object has a
width or height of 0. This is probably happening due to the thin "helper"
line that is being drawn. It might be possible to guard against this in
Arcadia, enforcing a min canvas cache size of 1x1.
[x] Button event handlers don't seem to get cleaned up properly when changing
between scenes
[x] Draw bridges correctly; i.e. one line per bridge
[x] Allow user to draw a second bridge between islands
[x] Program a "win" condition
[x] "you win" effect - bridges disappear, islands grow, then shrink to nothing,
	generating a particle effect when they disappear
[x] How to associate a bridge with an island?
	* A graph?
[x] How to clear bridges?
	* Could we have an invisible hitbox between islands?
[x] Determine how to find out if a puzzle is cleared or not
	* Store how many bridges lead out from an island
[x] Don't allow drawing lines from an island if it already has the max # of bridges
[x] Some kind of level editor? How would this work?
	* Re-use game mode, with "editor" flag? Or easier to copy/paste and change
	  relevant bits?
	* A touch that doesn't hit anything will create an empty vertex, snapped
	  to intervals of vertex.size/2
	* Can draw between vertices as normal, vertex connection count will simply
	  increase/reflect current state
	* Tapping an empty vertex will remove it
	* Since this will be an "internal-only" tool for now, don't bother with
	  enforcing graph connectedness
	* Create a basic level select view, which will re-use the circular vertex
	  object, and just display the puzzle # on it; completed puzzles will have
	  a green background
	* At this point, I don't care about a time limit or whatever

[x] Title screen will just be tap to start; take you to the next uncompleted puzzle
[x] Can get to level select by backing out of current puzzle, or at win condition
[x] Need some sort of button on the game view which allows user to quit puzzle
[x] Draw edges in editor
[x] Allow going back to level select after win
[x] Scroll paginated level icons
[x] Handle fast clicks on pagination buttons
[x] Upload to web
[x] Create basic icon
[x] `onPointEnd` seems to be getting called twice on iOS
[x] Extract to its own repo
[x] Change red/green colors to be more readable w/ white text
[x] Check for collision of a vertex in between start/end vertices
[x] Make vertices larger/easier for touch
[x] Create "credits" screen
[x] Determine why vertices that are very close together draw edges 90deg off
[x] Make minimum distance between nodes in editor larger
[x] Create ~100 puzzles
[x] Turn off drawing line when puzzle is complete
[x] Create Cordova project

# Rules

Bridges can only connect at 90deg angles.
There can be a max of two bridges between each island
Bridges can't overlap

## Brainstorm

The "active bridge" is just a line used for display; after a successful bridge
placement, it disappears and a static bridge object is placed, with a decent-sized
hitbox. Can then easily prevent overlapping, due to AABB intersection checking.
Tapping the bridge hitbox will remove a strand of the bridge. A bridge will also
be prevented from being built if it collides with an island in the middle.

(So bridges can only connect if they're the same X or Y coordinates. If X coords
are the same, then it's a vertical bridge. If Y coords are the same, then it's
a horizontal bridge.)

How to store the game's state? A bridge object will store what two islands it
is connecting. When the bridge is placed, the two islands will increase their
internal counter. When the bridge is removed, the two islands will decrease the
counter.

How to check for completion? I guess technically it's a graph, so could iterate
through all the placed bridges and ensure that the ID of each island was
referenced at least once.

# Video script

Hi, thanks for checking out Let's Build Bridges.

It's a logic puzzle game where you draw bridges to connect islands.

I'm going to quickly show you how to solve one of the puzzles.

The goal is to draw bridges to connect each island.

The number on each island represents the number of bridges that
can connect to it.

If you make a mistake, just tap the bridge to erase.

Once all the bridges are connected, the puzzle is complete!




