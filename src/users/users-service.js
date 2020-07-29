const UsersService = {

    getUsers(db) {
        return db('users')
            .from('users')
            .select('id', 'user_name', 'user_pic', 'password')
    }

}  

module.exports = UsersService