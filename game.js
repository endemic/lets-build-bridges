/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var Game = function (options) {
    Arcadia.Scene.apply(this, arguments);
    if (options === undefined) {
        options = {};
    }

    // Background color
    this.color = 'purple';

    // Object that tracks player's cursor/finger; used for collision detection 
    this.cursor = new Arcadia.Shape({
        size: { width: 8, height: 8 },
        vertices: 0,
        color: 'white'
    });
    this.add(this.cursor);
    this.deactivate(this.cursor);

    // Data structure for the vertices/edges in the graph
    this.vertices = [];
    this.edges = [];

    // TODO: Load the puzzle here
    this.level = options.level || 0;
    this.load();

    // Line that is shown while dragging from one vertex to another
    this.activeEdge = new Arcadia.Shape({
        size: { width: 2, height: 2 }
    });
    this.add(this.activeEdge);
    this.deactivate(this.activeEdge);
};

Game.prototype = new Arcadia.Scene();

Game.prototype.load = function () {
    var levels = localStorage.getObject('levels'),
        vertexData,
        _this = this;

    if (levels[this.level] === undefined) {
        throw new Error('No previously-stored level data for #' + (this.level + 1));
    }

    data = levels[this.level];

    // Re-create vertices
    data['vertices'].forEach(function (data) {
        var v = new Vertex({
            position: data.position,
            number: data.number,
            id: data.id,
        });

        _this.vertices.push(v);
        _this.add(v);
    });
};

Game.prototype.onPointStart = function (points) {
    var i, vertex;

    // Show the "cursor" object; move it to the mouse/touch point
    this.activate(this.cursor);
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    i = this.vertices.length;
    while (i--) {
        vertex = this.vertices[i];

        // Determine if user touched a vertex
        if (this.cursor.collidesWith(vertex)) {
            this.startVertex = vertex;
            var distance = Math.sqrt(Math.pow(this.cursor.position.x - this.startVertex.position.x, 2) + Math.pow(this.cursor.position.y - this.startVertex.position.y, 2));

            // If so, start drawing a line
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

Game.prototype.onPointMove = function (points) {
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

Game.prototype.onPointEnd = function (points) {
    var collision,
        edge,
        endVertex,
        i,
        vertexIds;

    if (this.startVertex) {
        i = this.vertices.length;
        while (i--) {
            endVertex = this.vertices[i];

            // Determine if player ended click/touch on a vertex (that's different from the starting vertex)
            if (this.cursor.collidesWith(endVertex) && endVertex.id != this.startVertex.id) {
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
                    
                    // check collision
                    j = this.edges.length;
                    while (j--) {
                        if (edge.collidesWith(this.edges[j])) {
                            collision = this.edges[j];
                            vertexIds = [collision.vertices[0].id, collision.vertices[1].id];
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

                        Arcadia.playSfx('build');
                    // Increment existing edge
                    } else if (vertexIds.indexOf(this.startVertex.id) !== -1 &&  vertexIds.indexOf(endVertex.id) !== -1) {
                        if (collision.increment()) {
                            collision.vertices[0].updateColor();
                            collision.vertices[1].updateColor();
                            Arcadia.playSfx('build');
                        } else {
                            Arcadia.playSfx('invalid');
                        }
                    // Invalid move
                    // TODO is this condition necessary?
                    } else {
                        Arcadia.playSfx('invalid');
                        throw new Error('strange condition');
                    }
                } else {
                    // Diagonal edges aren't allowed
                    Arcadia.playSfx('invalid');
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
                Arcadia.playSfx('erase');
            }
        }
    }

    this.deactivate(this.cursor);

    this.checkCompleteness();
};

// https://en.wikipedia.org/wiki/Depth-first_search
// Need each vertex to store a list of its connected edges
Game.prototype.search = function (vertex, listOfTraversedVertices) {
    var _this = this;

    if (listOfTraversedVertices.indexOf(vertex.id) !== -1) {
        return;
    }

    listOfTraversedVertices.push(vertex.id);
    vertex.edges.forEach(function (edge) {
       _this.search(edge.vertices[0], listOfTraversedVertices);
       _this.search(edge.vertices[1], listOfTraversedVertices);
    });
};

Game.prototype.checkCompleteness = function () {
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
            // TODO: display this in a better way
            alert('nice try, cheeter');
        }
    }
};

// Show a "u won, next level?" sort of message
Game.prototype.win = function () {

    var button,
        completed,
        i = this.edges.length,
        _this = this;

    // Hide edges
    while (i--) {
        this.edges[i].tween('alpha', 0, 1000);
    }

    // Particle emitters
    this.particles = new Arcadia.Pool();
    this.particles.factory = function () {
        var emitter,
            factory;

        factory = function () {
            return new Arcadia.Shape({
                color: '#fff',
                size: { width: 6, height: 6 },
                vertices: 0
            });
        };
        emitter = new Arcadia.Emitter(factory, 50);
        emitter.duration = 1.0;
        emitter.scale = -1;
        return emitter;
    };
    while (this.particles.length < this.vertices.length) {
        this.particles.activate();
    }
    this.particles.deactivateAll();
    this.add(this.particles);

    // Shrink vertices, then show an "explosion"
    this.vertices.forEach(function (vertex) {
        vertex.tween('scale', 0, 2000, 'elasticInOut', function () {
            _this.particles.activate().startAt(vertex.position.x, vertex.position.y);
        });
    });

    completed = localStorage.getObject('completed') || [];
    completed[this.level] = true;
    localStorage.setObject('completed', completed);

    button = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 2
        },
        color: null,
        border: '2px #fff',
        padding: 15,
        text: 'continue',
        font: '20px monospace',
        alpha: 0,
        action: function () {
            Arcadia.changeScene(LevelSelect);
        }
    });
    this.add(button);
    button.tween('alpha', 1, 2000);
};
