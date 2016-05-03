/*jslint sloppy: true, plusplus: true */
/*globals window, Arcadia, LevelSelectScene, CreditsScene, localStorage, LEVELS, Vertex, Edge */

var GameScene = function (options) {
    Arcadia.Scene.apply(this, arguments);

    options = options || {};

    var actionWord = Arcadia.ENV.mobile ? 'Tap' : 'Click';
    var self = this;

    this.buttonPadding = 10;
    this.animationDuration = 2000;

    // Background/vertex color
    Vertex.DEFAULT_COLOR = Arcadia.cycleBackground();

    // Data structure for the vertices/edges in the graph
    this.vertices = [];
    this.edges = [];

    // Show game title/basic help text if no level # passed
    if (!options.hasOwnProperty('level')) {
        this.level = 0;
        this.isTitle = true;
    } else {
        this.level = options.level;
    }

    // Load the puzzle data
    this.load();

    // Object that tracks player's cursor/finger; used for collision detection
    this.cursor = new Arcadia.Shape({
        size: { width: 8, height: 8 },
        vertices: 0
    });
    this.add(this.cursor);
    this.deactivate(this.cursor);

    // Line that is shown while dragging from one vertex to another
    this.activeEdge = new Arcadia.Shape({
        size: { width: 2, height: 2 }
    });
    this.add(this.activeEdge);
    this.deactivate(this.activeEdge);

    if (this.isTitle) {
        // Create title/help text
        this.titleLabel = new Arcadia.Label({
            position: {
                x: 0,
                y: -Arcadia.VIEWPORT_HEIGHT / 4
            },
            color: '#fff',
            font: '48px monospace',
            text: "Let's\nBuild\nBridges!"
        });
        this.add(this.titleLabel);

        this.helpLabel = new Arcadia.Label({
            position: {
                x: 0,
                y: Arcadia.VIEWPORT_HEIGHT / 3
            },
            color: '#fff',
            font: '20 monospace',
            text: actionWord + ' and drag to draw.\n' + actionWord + ' to erase.'
        });
        this.add(this.helpLabel);
    } else {
        // Create "quit" and "reset" buttons at top of screen
        this.resetButton = new Arcadia.Button({
            color: null,
            border: '2px #fff',
            padding: this.buttonPadding,
            text: 'reset',
            font: '26px monospace',
            action: function () {
                sona.play('button');
                // Clear out all edges
                self.vertices.forEach(function (vertex) {
                    vertex.edges = [];
                    vertex.updateColor();
                });

                self.edges.forEach(function (edge) {
                    self.remove(edge);
                });
                self.edges = [];
            }
        });
        this.resetButton.position = {
            x: this.size.width / 2 - this.resetButton.size.width / 2 - this.buttonPadding,
            y: -this.size.height / 2 + this.resetButton.size.height / 2 + this.buttonPadding
        };
        this.add(this.resetButton);

        // Go back to level select
        this.backButton = new Arcadia.Button({
            color: null,
            border: '2px #fff',
            padding: this.buttonPadding,
            text: 'quit',
            font: '26px monospace',
            action: function () {
                sona.play('button');
                Arcadia.changeScene(LevelSelectScene, { selected: self.level });
            }
        });
        this.backButton.position = {
            x: -this.size.width / 2 + this.backButton.size.width / 2 + this.buttonPadding,
            y: -this.size.height / 2 + this.backButton.size.height / 2 + this.buttonPadding
        };
        this.add(this.backButton);
    }

    // Load AdMob content
    if (AdMob) {
        AdMob.prepareInterstitial({
            adId: 'ca-app-pub-8045350589241869/6289115038',
            autoShow: false
        }, function success() {
            self.adLoaded = true;
        }, function failure() {
            self.adLoaded = false;
        });
    }
};

GameScene.prototype = new Arcadia.Scene();

GameScene.prototype.load = function () {
    var levels = localStorage.getObject('levels') || LEVELS;
    var self = this;

    if (!levels[this.level]) {
        alert('No level data for #' + (this.level + 1));
        Arcadia.changeScene(LevelSelectScene, { selected: self.level });
    }

    var data = levels[this.level];

    // Re-create vertices
    data.vertices.forEach(function (data) {
        var v = new Vertex({
            position: data.position,
            number: data.number,
            id: data.id,
            scale: 0 // initially small, yo
        });

        self.vertices.push(v);
        self.add(v);
    });

    // Grow vertices
    this.vertices.forEach(function (vertex) {
        vertex.tween('scale', 1, self.animationDuration, 'elasticOut');
    });
};

GameScene.prototype.onPointStart = function (points) {
    Arcadia.Scene.prototype.onPointStart.call(this, points); // "super()"

    if (this.gameOver) {
        return;
    }

    // Show the "cursor" object; move it to the mouse/touch point
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    var i = this.vertices.length;
    var vertex;
    var distance;

    while (i--) {
        vertex = this.vertices[i];

        // Determine if user touched a vertex
        if (this.cursor.collidesWith(vertex)) {
            this.startVertex = vertex;
            distance = Math.sqrt(Math.pow(this.cursor.position.x - this.startVertex.position.x, 2) + Math.pow(this.cursor.position.y - this.startVertex.position.y, 2));

            // If so, start drawing cursor/line
            this.activate(this.cursor);
            this.activate(this.activeEdge);
            this.activeEdge.size = { width: 2, height: distance };
            this.activeEdge.rotation = Math.atan2(this.cursor.position.y - this.startVertex.position.y, this.cursor.position.x - this.startVertex.position.x) + Math.PI / 2;
            this.activeEdge.position = {
                // halfway between cursor and vertex
                x: (this.cursor.position.x + this.startVertex.position.x) / 2,
                y: (this.cursor.position.y + this.startVertex.position.y) / 2
            };
        }
    }
};

GameScene.prototype.onPointMove = function (points) {
    Arcadia.Scene.prototype.onPointMove.call(this, points); // "super()"

    if (this.gameOver) {
        return;
    }

    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    // If currently drawing an edge (from the startVertex), update the
    // "interactive" drawing line
    if (this.startVertex) {
        var distance = Math.sqrt(Math.pow(this.cursor.position.x - this.startVertex.position.x, 2) + Math.pow(this.cursor.position.y - this.startVertex.position.y, 2));
        this.activeEdge.size = { width: 2, height: distance };
        this.activeEdge.rotation = Math.atan2(this.cursor.position.y - this.startVertex.position.y, this.cursor.position.x - this.startVertex.position.x) + Math.PI / 2;
        this.activeEdge.position = {
            x: (this.cursor.position.x + this.startVertex.position.x) / 2,
            y: (this.cursor.position.y + this.startVertex.position.y) / 2
        };
    }
};

GameScene.prototype.onPointEnd = function (points) {
    Arcadia.Scene.prototype.onPointEnd.call(this, points); // "super()"

    if (this.gameOver) {
        return;
    }

    var collision,
        edge,
        endVertex,
        i,
        j,
        vertexIds;

    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    if (this.startVertex) {
        i = this.vertices.length;
        while (i--) {
            endVertex = this.vertices[i];

            // Determine if player ended click/touch on a vertex (that's different from the starting vertex)
            if (this.cursor.collidesWith(endVertex) && endVertex.id !== this.startVertex.id) {
                // If valid, 90 degree move
                if (this.startVertex.position.x === endVertex.position.x || this.startVertex.position.y === endVertex.position.y) {
                    // Place edge object
                    edge = new Edge();

                    // Horizontal edge
                    if (this.startVertex.position.x === endVertex.position.x) {
                        edge.position = {
                            x: this.startVertex.position.x,
                            y: (this.startVertex.position.y + endVertex.position.y) / 2
                        };
                        edge.size = {
                            width: Vertex.SIZE / 2,
                            height: Math.abs(this.startVertex.position.y - endVertex.position.y) - Vertex.SIZE
                        };
                    // Vertical edge
                    } else if (this.startVertex.position.y === endVertex.position.y) {
                        edge.position = {
                            x: (this.startVertex.position.x + endVertex.position.x) / 2,
                            y: this.startVertex.position.y
                        };
                        edge.size = {
                            width: Math.abs(this.startVertex.position.x - endVertex.position.x) - Vertex.SIZE,
                            height: Vertex.SIZE / 2
                        };
                    }

                    // Check collision against other edges
                    j = this.edges.length;
                    while (j--) {
                        if (edge.collidesWith(this.edges[j])) {
                            collision = this.edges[j];
                            vertexIds = [collision.vertices[0].id, collision.vertices[1].id];
                        }
                    }

                    // Check collisions against other vertices
                    j = this.vertices.length;
                    while (j--) {
                        if (edge.collidesWith(this.vertices[j]) && [this.startVertex.id, endVertex.id].indexOf(this.vertices[j].id) === -1) {
                            collision = true;
                            vertexIds = [];
                        }
                    }

                    // If successful, add the edge
                    if (!collision) {
                        this.startVertex.addEdge(edge);
                        endVertex.addEdge(edge);
                        edge.vertices.push(this.startVertex);
                        edge.vertices.push(endVertex);

                        this.edges.push(edge);
                        this.add(edge);

                        sona.play('build');
                    // Increment existing edge
                    } else if (vertexIds.indexOf(this.startVertex.id) !== -1 &&  vertexIds.indexOf(endVertex.id) !== -1) {
                        if (collision.increment()) {
                            collision.vertices[0].updateColor();
                            collision.vertices[1].updateColor();
                            sona.play('build');
                        } else {
                            sona.play('invalid');
                        }
                    // Invalid move - tried to cross an edge or vertex
                    } else {
                        sona.play('invalid');
                    }
                } else {
                    // Diagonal edges aren't allowed
                    sona.play('invalid');
                }
            }
        }

        this.deactivate(this.activeEdge);
        this.startVertex = null;
    } else {
        // Determine if user touched a edge; if so, remove it
        i = this.edges.length;
        while (i--) {
            if (this.cursor.collidesWith(this.edges[i])) {
                edge = this.edges[i];
                edge.vertices[0].removeEdge(edge);
                edge.vertices[1].removeEdge(edge);
                this.remove(edge);
                this.edges.splice(i, 1);
                sona.play('erase');
            }
        }
    }

    this.deactivate(this.cursor);

    this.checkCompleteness();
};

// https://en.wikipedia.org/wiki/Depth-first_search
// Need each vertex to store a list of its connected edges
GameScene.prototype.search = function (vertex, listOfTraversedVertices) {
    var self = this;

    if (listOfTraversedVertices.indexOf(vertex.id) !== -1) {
        return;
    }

    listOfTraversedVertices.push(vertex.id);
    vertex.edges.forEach(function (edge) {
        self.search(edge.vertices[0], listOfTraversedVertices);
        self.search(edge.vertices[1], listOfTraversedVertices);
    });
};

GameScene.prototype.checkCompleteness = function () {
    var complete,
        foundVertices;

    // Fast check - ensure all vertices have correct # of edges
    complete = this.vertices.every(function (vertex) {
        return vertex.isComplete();
    });

    // Slow check - ensure all nodes on the graph are connected
    if (complete) {
        foundVertices = [];
        this.search(this.vertices[0], foundVertices);
        // Basically start at one vertex, and see if we can traverse the whole
        // graph -- if the # of vertices found by the search equals the number
        // in the puzzle, then it's a correct solution
        if (foundVertices.length === this.vertices.length) {
            this.win();
        } else {
            // TODO: display this in a better (i.e. non-alert) way
            window.setTimeout(function () {
                alert('All nodes must be connected!');
            }, 1000);
        }
    }
};

// Show a "u won, next level?" sort of message
GameScene.prototype.win = function () {
    var self = this;

    // Disable touch/mouse methods for drawing
    this.gameOver = true;

    // Hide edges
    this.edges.forEach(function (edge) {
        edge.tween('alpha', 0, 1000);
    });

    // Shrink vertices
    this.vertices.forEach(function (vertex) {
        vertex.tween('scale', 0, self.animationDuration, 'elasticIn');
    });

    var completed = localStorage.getObject('completed') || [];
    while (completed.length < LEVELS.length) {
        completed.push(null);
    }
    completed[this.level] = true;
    localStorage.setObject('completed', completed);

    var percentComplete = completed.filter(function (entry) {
        return entry === true;
    }).length / completed.length;

    var progressAscii = '[';
    while (progressAscii.length <= 10) {
        if (progressAscii.length <= percentComplete * 10) {
            progressAscii += '=';
        } else {
            progressAscii += '-';
        }
    }
    progressAscii += ']';

    var nextButton = new Arcadia.Button({
        position: { x: 0, y: -40 },
        padding: this.buttonPadding,
        color: null,
        border: '2px #fff',
        text: 'next',
        font: '26px monospace',
        action: function () {
            sona.play('button');

            var incompleteLevel = completed.indexOf(null);
            var nagShown = localStorage.getBoolean('nagShown');
            var NAG_FOR_REVIEW_THRESHOLD = 0.4;

            if (incompleteLevel === -1) {
                Arcadia.changeScene(CreditsScene);
            } else if (Arcadia.isLocked() && incompleteLevel >= 15) {
                Arcadia.changeScene(UnlockScene);
            } else if (Arcadia.ENV.cordova && percentComplete > NAG_FOR_REVIEW_THRESHOLD && !nagShown) {
                Arcadia.changeScene(ReviewNagScene, {level: incompleteLevel});
            } else {
                window.onAdDismiss = function () {
                    Arcadia.changeScene(GameScene, {level: incompleteLevel});
                };

                if (self.adLoaded) {
                    // Re-attach dismissal event listener
                    document.removeEventListener('onAdDismiss', window.onAdDismiss);
                    document.addEventListener('onAdDismiss', window.onAdDismiss);
                    AdMob.showInterstitial();
                } else {
                    window.onAdDismiss();
                }
            }
        }
    });
    this.add(nextButton);
    this.deactivate(nextButton);

    var progressBar = new Arcadia.Label({
        position: { x: 0, y: 40 },
        color: 'white',
        font: '26px monospace',
        text: 'progress\n' + progressAscii
    });
    this.add(progressBar);
    this.deactivate(progressBar);

    window.setTimeout(function () {
        self.activate(nextButton);
        self.activate(progressBar);
    }, this.animationDuration);
};
