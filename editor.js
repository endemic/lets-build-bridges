/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var Editor = function (options) {
    Arcadia.Scene.apply(this, arguments);
    if (options === undefined) {
        options = {};
    }

    this.color = 'purple';

    // Object that tracks player's cursor/finger; used for collision detection 
    this.cursor = new Arcadia.Shape({
        size: { width: 8, height: 8 },
        vertices: 0,
        color: 'white'
    });
    this.add(this.cursor);
    this.deactivate(this.cursor);

    // Data structures for the vertices/edges in the graph
    this.vertices = [];
    this.edges = [];

    this.level = options.level || 0;
    this.load();

    // Line that is shown while dragging from one vertex to another
    this.activeEdge = new Arcadia.Shape({
        size: { width: 2, height: 2 }
    });
    this.add(this.activeEdge);
    this.deactivate(this.activeEdge);
    
    // Export data to console/localStorage
    this.saveButton = new Arcadia.Button({
        color: null,
        border: '2px #fff',
        padding: 5,
        text: 'save',
        font: '20px monospace',
        action: this.save.bind(this)
    });
    this.saveButton.position = {
        x: Arcadia.WIDTH - this.saveButton.size.width / 2,
        y: this.saveButton.size.height / 2
    };
    this.add(this.saveButton);

    // Go back to level select
    this.backButton = new Arcadia.Button({
        color: null,
        border: '2px #fff',
        padding: 5,
        text: 'quit',
        font: '20px monospace',
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(LevelSelect);
        }
    });
    this.backButton.position = {
        x: this.backButton.size.width / 2,
        y: this.backButton.size.height / 2
    };
    this.add(this.backButton);

    // Hidden shape to allow for direct manipulation of puzzle area
    // Basically to prevent random touches from interfering with UI
    this.interactiveArea = new Arcadia.Shape({
        color: null,
        size: {
            width: Arcadia.WIDTH,
            height: Arcadia.HEIGHT
        },
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 2 + 25
        }
    });
    this.add(this.interactiveArea);
};

Editor.prototype = new Arcadia.Scene();

Editor.prototype.save = function () {
    var data,
        levels;

    Arcadia.playSfx('button');

    data = {
        vertices: this.vertices.map(function (vertex) {
            return {
                position: vertex.position,
                number: vertex.number,
                id: vertex.id
            };
        }),
        edges: this.edges.map(function (edge) {
            return {
                count: edge.count,
                vertexIds: edge.vertices.map(function (vertex) { return vertex.id; })
            };
        })
    };

    console.log(JSON.stringify(data));
    
    levels = localStorage.getObject('levels') || [];
    levels[this.level] = data;
    localStorage.setObject('levels', levels);
};

Editor.prototype.load = function () {
    var levels,
        vertexData,
        _this = this;

    levels = localStorage.getObject('levels') || [];

    if (levels[this.level] === undefined) {
        console.warn('No previously-stored level data.');
        return;
    }

    data = levels[this.level];

    data['vertices'].forEach(function (data) {
        // Re-create vertices
        var v = new Vertex({
            position: data.position,
            number: data.number,
            id: data.id,
        });

        _this.vertices.push(v);
        _this.add(v);
    });

    data['edges'].forEach(function (data) {
        // Re-create edges
        var e, v1, v2;

        v1 = _this.vertices.find(function (v) { return v.id === data.vertexIds[0]; });
        v2 = _this.vertices.find(function (v) { return v.id === data.vertexIds[1]; });

        e = new Edge();
        e.vertices = [v1, v2];

        // Horizontal edge
        if (v1.position.x === v2.position.x) {
            e.position = {
                x: v1.position.x,
                y: (v1.position.y + v2.position.y) / 2
            };
            e.size = {
                width: Vertex.SIZE / 2,
                height: Math.abs(v1.position.y - v2.position.y) - Vertex.SIZE
            };
        // Vertical edge
        } else if (v1.position.y === v2.position.y) {
            e.position = {
                x: (v1.position.x + v2.position.x) / 2,
                y: v1.position.y
            };
            e.size = {
                width: Math.abs(v1.position.x - v2.position.x) - Vertex.SIZE,
                height: Vertex.SIZE / 2
            };
        }

        if (data.count > 1) {
            e.increment();
        }

        _this.edges.push(e);
        _this.add(e);
    });
};

Editor.prototype.onPointStart = function (points) {
    var i, vertex;

    // Show the "cursor" object; move it to the mouse/touch point
    this.activate(this.cursor);
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    if (!this.cursor.collidesWith(this.interactiveArea)) {
        return;
    }

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

Editor.prototype.onPointMove = function (points) {
    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };

    if (!this.cursor.collidesWith(this.interactiveArea)) {
        return;
    }

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

Editor.prototype.onPointEnd = function (points) {
    var collision,
        edge,
        endVertex,
        i,
        v,
        vertexIds;

    this.cursor.position = {
        x: points[0].x,
        y: points[0].y
    };
    this.deactivate(this.cursor);

    if (!this.cursor.collidesWith(this.interactiveArea)) {
        return;
    }

    if (this.startVertex) {
        i = this.vertices.length;
        while (i--) {
            endVertex = this.vertices[i];

            // Skip the rest of the iteration if not ending on a vertex
            if (!this.cursor.collidesWith(endVertex)) {
                continue;
            }

            // Determine if player ended click/touch on a vertex (that's different from the starting vertex)
            if (endVertex.id != this.startVertex.id) {
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
                        // Update vertices
                        this.startVertex.increment();
                        this.startVertex.addEdge(edge);
                        endVertex.increment();
                        endVertex.addEdge(edge);
                        // Update edge
                        edge.vertices.push(this.startVertex);
                        edge.vertices.push(endVertex);
                        this.edges.push(edge);
                        this.add(edge);

                        Arcadia.playSfx('build');
                    // Increment existing edge
                    } else if (vertexIds.indexOf(this.startVertex.id) !== -1 &&  vertexIds.indexOf(endVertex.id) !== -1) {
                        if (collision.increment()) {
                            collision.vertices[0].increment();
                            collision.vertices[1].increment();
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

            // If touching the same vertex, and it's empty, remove it
            } else if (endVertex.id === this.startVertex.id && this.startVertex.edgeCount() === 0) {
                index = this.vertices.indexOf(this.startVertex);
                this.vertices.splice(index, 1);
                this.remove(this.startVertex);
            }
        }

        this.deactivate(this.activeEdge);
        this.startVertex = null;
    } else {
        var success = true;
        var removedEdge = false;

        // Determine if user touched a edge; if so, remove it
        i = this.edges.length;
        while (i--) {
            edge = this.edges[i];

            if (this.cursor.collidesWith(edge)) {
                edge.vertices[0].decrement(edge.count);
                edge.vertices[0].removeEdge(edge);
                edge.vertices[1].decrement(edge.count);
                edge.vertices[1].removeEdge(edge);

                this.remove(edge);
                this.edges.splice(i, 1);

                Arcadia.playSfx('erase');
                removedEdge = true;
            }
        }

        // place a vertex here if it won't collide w/ an existing edge or 
        // vertex, and we didn't _just_ remove an edge
        var halfSpacing = 26;
        if (!removedEdge) {
            v = new Vertex({
                position: {
                    x: Math.round(points[0].x / halfSpacing) * halfSpacing,
                    y: Math.round(points[0].y / halfSpacing) * halfSpacing
                }
            });

            i = this.vertices.length;
            while (i--) {
                if (v.collidesWith(this.vertices[i])) {
                    success = false;
                }
            }

            i = this.edges.length;
            while (i--) {
                if (v.collidesWith(this.edges[i])) {
                    success = false;
                }
            }

            // if no collision, add it
            if (success) {
                this.add(v);
                this.vertices.push(v);
            }
        }
    }

    // this.checkCompleteness();
};

// https://en.wikipedia.org/wiki/Depth-first_search
// Need each vertex to store a list of its connected edges
Editor.prototype.search = function (vertex, listOfTraversedVertices) {
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

Editor.prototype.checkCompleteness = function () {
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
        
        if (foundVertices.length === this.vertices.length) {
            // Enable a "save" button
        }
    }
};
