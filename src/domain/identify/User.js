class User {
    constructor(id, name, email) {
        if (!id) throw new Error('User ID is required');
        if (!email || !email.includes('@')) throw new Error('Valid email is required');

        this.id = id;
        this.name = name;
        this.email = email;
    }
}

module.exports = User;