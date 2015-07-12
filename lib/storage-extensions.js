Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
    return null;
};

Storage.prototype.setBoolean = function (key, value) {
    this.setItem(key, !!value);
};

Storage.prototype.getBoolean = function (key) {
    return this.getItem(key) == 'true';
};
