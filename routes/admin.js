// Filename : admin.js

const express = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const { ADMINAUTHID } = require('../config/config')

const router = express.Router()
const adauth = require('../middleware/adauth')
const Admin = require('../model/Admin')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

/**
 * @method - POST
 * @param - /signup
 * @description - Admin SignUp
 */
router.get('/login', (req, res) => {
  console.log('I am here inside route admin')
  res.sendFile(path.resolve(__dirname, '../views/admin/login.html'))
  console.log('nanu login page olage hogta edini')
})

// router.get('/login', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../views/admin/login.html'))
// })

router.post('/signup', async (req, res) => {
  const { username, email, password, authId } = req.body
  try {
    if (authId != ADMINAUTHID) {
      return res.status(400).json({
        msg: 'Auth ID is incorrect'
      })
    }
    let admin = await Admin.findOne({
      email
    })
    if (admin) {
      return res.status(400).json({
        msg: 'User Already Exists'
      })
    }

    admin = new Admin({
      username,
      email,
      password
    })

    const salt = await bcrypt.genSalt(10)
    admin.password = await bcrypt.hash(password, salt)

    await admin.save()

    const payload = {
      admin: {
        id: admin.id
      }
    }

    jwt.sign(
      payload,
      'nanuadmin',
      {
        expiresIn: 10000
      },
      (err, token) => {
        if (err) throw err
        res.cookie('token', token)
        res.cookie('adminID', admin.id)
        res.status(200).json({
          adminId: admin.id,
          adminEmail: admin.email
        })
      }
    )
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Error in Saving')
  }
})

router.post('/login', async (req, res) => {
  console.log("Just entered login");
  const { email, password } = req.body
  try {
    console.log("Insider try block");
    let admin = await Admin.findOne({
      email
    })
    if (!admin){
      console.log("Admin ilvante");
      return res.status(400).json({
        message: 'User Not Exist'
      })
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch){
      console.log("Password sari ila lo");
      return res.status(400).json({
        error: 'true',
        message: 'Incorrect Password !'
      })
    }
    const payload = {
      admin: {
        id: admin.id
      }
    }
    console.log("sign madtidare ega");
    jwt.sign(
      payload,
      'nanuadmin',
      {
        expiresIn: 3600
      },
      (err, token) => {
        if (err) throw err
        res.cookie('token', token)
        res.cookie('adminID', admin.id)
        console.log("ella chennag aytu");
        res.status(200).json({
          adminId: admin.id,
          adminEmail: admin.email,
          token: token
        })
      }
    )
  } catch (e) {
    console.log("ELlo miss hoditide");
    console.error(e)
    res.status(500).json({
      message: 'Server Error'
    })
  }
})

/**
 * @method - GET
 * @description - Get LoggedIn Admin
 * @param - /admin/me
 */

router.get('/dashboard', adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/ADashboard.html'))
})

router.get('/me', adauth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const admin = await Admin.findById(req.admin.id)
    res.json(admin)
  } catch (e) {
    res.send({ message: 'Error in Fetching user' })
  }
})

module.exports = router
