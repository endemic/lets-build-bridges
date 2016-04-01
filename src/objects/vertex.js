var Vertex = function (args) {
    Arcadia.Shape.apply(this, arguments);

    if (window.VERTEX_ID === undefined) {
        window.VERTEX_ID = 0;
    }

    this.size = { width: Vertex.SIZE, height: Vertex.SIZE };
    this.vertices = 0;
    this.color = Vertex.DEFAULT_COLOR;
    this.border = '2px #fff';
    this.number = 0;
    this.edges = [];

    if (args.hasOwnProperty('id')) {
        this.id = args.id;
    } else {
        this.id = window.VERTEX_ID;
        window.VERTEX_ID += 1;
    }

    if (args.hasOwnProperty('number')) {
        this.number = args.number;
    }

    this.label = new Arcadia.Label({
        font: '24px monospace',
        text: this.number,
        fixed: false
    });
    this.add(this.label);
};

Vertex.prototype = new Arcadia.Shape();

Vertex.prototype.highlight = function () {
    this.border = '3px white';
    this.scale = 1.2;
};

Vertex.prototype.lowlight = function () {
    this.border = '2px white';
    this.scale = 1;
};

Vertex.prototype.isComplete = function () {
    return this.number == this.edgeCount();
};

Vertex.prototype.edgeCount = function () {
    return this.edges.reduce(function (previous, current) {
        return previous + current.count;
    }, 0);
};

Vertex.prototype.addEdge = function (edge) {
    this.edges.push(edge);
    this.updateColor();
};

Vertex.prototype.removeEdge = function (edge) {
    var index = this.edges.indexOf(edge);
    this.edges.splice(index, 1);

    this.updateColor();
};

Vertex.prototype.increment = function () {
    this.number += 1;
    this.label.text = this.number;
};

Vertex.prototype.decrement = function (count) {
    this.number -= count;
    this.label.text = this.number;
};

Vertex.prototype.updateColor = function () {
    var count = this.edgeCount();

    if (count === this.number) {
        this.color = Vertex.CORRECT_COLOR;
    } else if (count > this.number) {
        this.color = Vertex.INCORRECT_COLOR;
    } else {
        this.color = Vertex.DEFAULT_COLOR;
    }
};

Vertex.SIZE = 44;
Vertex.CORRECT_COLOR = 'limegreen';
Vertex.INCORRECT_COLOR = 'crimson';
Vertex.DEFAULT_COLOR = 'purple';
