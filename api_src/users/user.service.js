const pool = require('../../config/database');

module.exports = {
  create: (data, callback) => {
    pool.query(
      'insert into users(username, email, password) VALUES (?,?,?)',
      [
        data.username,
        data.email,
        data.password
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error)
        }
        return callback(null, results)
      }
    );
  },
  getUsers: callback => {
    pool.query(
      'select id, username, email, password from users',
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getUserByID: (id, callback) => {
    pool.query(
      'select id, username, email from users where id = ?',
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  updateUser: (data, callback) => {
    pool.query(
      'update users set username=?, email=?, password=? where id=?',
      [
        data.username,
        data.email,
        data.password,
        data.id
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error)
        }
        return callback(null, results);
      }
    );
  },
  deleteUser: (id, callback) => {
    pool.query(
      'DELETE FROM users WHERE id=?',
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        callback(null, results); // No need to access results[0]
      }
    );
  },

  // getUserbyEmail: (email, callback) => {
  //     pool.query(
  //         `select * from users where email=?`,
  //         [email],
  //         (error, results, fields) => {
  //             if (error) {
  //                 console.error('Error in getUserbyEmail query:', error);
  //                 return callback(error);
  //             }

  //             console.log('Results from getUserbyEmail:', results);

  //             callback(null, results);
  //         }
  //     );
  // }

  getUserbyEmail: async (email) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results, fields) => {
          if (error) {
            console.error('Error in getUserbyEmail query:', error);
            reject(error);
          } else {
            console.log('Results from getUserbyEmail:', results);
            resolve(results[0]); // Assuming results is an array
          }
        }
      );
    });
  }

};
