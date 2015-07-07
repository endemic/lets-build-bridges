# TODO

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
[ ] Check for collision of a vertex in between start/end vertices
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

[ ] Title screen will just be tap to start; take you to the next uncompleted puzzle
[ ] Can get to level select by backing out of current puzzle, or at win condition
[ ] Need some sort of button on the game view which allows user to quit puzzle
[x] Draw edges in editor
[x] Allow going back to level select after win
[ ] Combine editor/game?
[ ] Scroll paginated level icons
[x] Upload to web
[x] Create basic icon
[ ] Alpha isn't passed down to children
[x] `onPointEnd` seems to be getting called twice on iOS
[ ] Extract to its own repo
[ ] Change red/green colors to be more readable w/ white text

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
