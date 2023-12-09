const {
  create,
  getUserByID,
  getUsers,
  updateUser,
  deleteUser,
  getUserbyEmail
} = require('./user.service');

const { genSaltSync, hashSync } = require('bcrypt');
const bcrypt = require('bcrypt');

const hashPassword = (password) => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

const { sign } = require('jsonwebtoken');

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    body.password = hashPassword(body.password);
    create(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database connection error'
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      })
    });
  },
  getUserByID: (req, res) => {
    const id = req.params.id;
    getUserByID(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: 'users not found'
        });
      }
      return res.json({
        success: 1,
        data: results
      });
    });
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results
      });
    });
  },
  updateUser: (req, res) => {
    const id = req.params.id;
    const body = req.body;
    body.password = hashPassword(body.password);

    updateUser({ id, ...body }, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Internal server error'
        });
      }
      if (results.affectedRows === 0) {
        return res.json({
          success: 0,
          message: 'User not found or no changes made'
        });
      }
      return res.json({
        success: 1,
        message: 'Data user updated successfully'
      });
    });
  },
  deleteUser: (req, res) => {
    const id = req.params.id;
    deleteUser(id, (err) => {
      if (err) {
        console.error(err);
        return res.json({
          success: 0,
          message: 'Internal server error'
        });
      }
      return res.json({
        success: 1,
        message: 'User deleted successfully'
      });
    });
  },
  // login: async (req, res) => {
  //     const { email, password } = req.body;
  //     getUserbyEmail(email, (err, results) => {
  //         if (err) {
  //             console.error('Error retrieving user by email:', err);
  //             return res.json({
  //                 success: 0,
  //                 data: 'Database error'
  //             });
  //         }

  //         // Check if results is defined
  //         if (results == null) {
  //             return res.json({
  //                 success: 0,
  //                 data: 'Invalid email or password'
  //             });
  //         }

  //         // Now you can safely access properties of results
  //         const passwordMatch = bcrypt.compare(password, results.password);

  //         if (passwordMatch) {
  //             // If the passwords match, generate a token or perform further actions
  //             results.password = undefined; // Make sure to remove the hashed password from the response
  //             const jsontoken = sign({ result: results }, 'qwe1234', {
  //                 expiresIn: '1h'
  //             });
  //             return res.json({
  //                 success: 1,
  //                 message: 'Login successful',
  //                 token: jsontoken
  //             });
  //         } else {
  //             // If passwords don't match, return an error response
  //             console.error('Password mismatch for user:', results.email);
  //             return res.json({
  //                 success: 0,
  //                 data: 'Invalid email or password'
  //             });
  //         }
  //     });
  // }
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const results = await getUserbyEmail(email);

      if (!results) {
        return res.json({
          success: 0,
          data: 'Invalid email or password'
        });
      }

      const passwordMatch = await bcrypt.compare(password, results.password);

      if (passwordMatch) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, 'qwe1234', {
          expiresIn: '1h'
        });

        return res.json({
          success: 1,
          message: 'Login successful',
          token: jsontoken
        });
      } else {
        console.error('Password mismatch for user:', results.email);
        return res.json({
          success: 0,
          data: 'Invalid email or password'
        });
      }
    } catch (error) {
      console.error('Error in login:', error);
      return res.json({
        success: 0,
        data: 'Internal server error'
      });
    }
  }
};
