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
const Company = require('../model/Company')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get('/login', (req, res) => {
  console.log('I am here inside route admin')
  res.sendFile(path.resolve(__dirname, '../views/admin/login.html'))
  console.log('nanu login page olage hogta edini')
})

router.get('/addrecruiters', adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/AddRecruiter.html'))
})

router.get('/logout', (req, res) => {
  res.cookie('token', undefined)
  res.cookie('adminID', undefined)
  res.redirect('./login')
})

router.get('/dashboard', adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/ADashboard.html'))
})

router.get('/recruiters', adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/AllRec.html'))
})

router.get('/reclist', async (req, res) =>{
  try{
    // let listComp = await Company.find().toArray(err, do)

    console.log("Company list is here with us");
    let listComp = await Company.find() //.toArray((err, documents)=>{
      // if(err){
      //   res.status(400).json({
      //     error: true,
      //     msg : "Could not fetch data, sorry :("
      //   }) 
      // }
      // else{
        console.log("Sending the required docs");
        res.json(listComp)
      // }
    // })
    // listComp.toArray
    // res.send(listComp);
  }
  catch(e){
    console.log("Error happend, c u in catch");
    res.status(400).json({
      error: true,
      msg : "Could not fetch data, sorry :("
    })
  }
})

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
  console.log('Just entered login')
  const { email, password } = req.body
  try {
    console.log('Insider try block')
    let admin = await Admin.findOne({
      email
    })
    if (!admin) {
      console.log('Admin ilvante')
      return res.status(400).json({
        message: 'User Not Exist'
      })
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      console.log('Password sari ila lo')
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
    console.log('sign madtidare ega')
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
        console.log('ella chennag aytu')
        res.status(200).json({
          adminId: admin.id,
          adminEmail: admin.email,
          token: token
        })
      }
    )
  } catch (e) {
    console.log('ELlo miss hoditide')
    console.error(e)
    res.status(500).json({
      message: 'Server Error'
    })
  }
})

router.post('/companies', adauth, async (req, res) => {
  console.log('Loooo kelstidyaa, I am inside this /companies')
  

  console.log('Loooo kelstidyaa, about to enter try block')
  try {
    const { companyname, website, package,cutoff } = req.body
    console.log('Loooo kelstidyaa, inside the try block')
    // let company = await Company.findOne({
    //   CId
    // })
    // if (company) {
    //   console.log('Loooo kelstidyaa, company agle edyante')
    //   company.Cname = Cname
    //   company.Cweb = Cweb
    //   company.Cpak = Cpak
    //   company.save()

    //   return res.status(200).json({
    //     error: false,
    //     msg: 'Company Already Existed, so updated the company data'
    //   })
    // }
    const candidates = []
    console.log('Loooo kelstidyaa, about to commit error, nodana enagutte')
    company = new Company({
      companyname,
      website,
      package,
      cutoff,
      candidates
    })
    console.log('Loooo kelstidyaa, can u see me')
    await company.save()
    console.log('Loooo kelstidyaa, save aytu lo')
    res.status(200).json({
      error: false,
      message: 'Data saved!'
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      error: true,
      message: 'Could not save data!'
    })
  }
})

router.use('*', (req, res) => {
  res.send('Error 404')
})

module.exports = router
