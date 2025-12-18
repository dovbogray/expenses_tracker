class Category {
    constructor(id, name) {
        if (!name) throw new Error('Category name cannot be empty');
        
        this.id = id;
        this.name = name;
    }
}

module.exports = Category;