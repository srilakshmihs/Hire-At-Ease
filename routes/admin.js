// Filename : admin.js

const express = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const { ADMINAUTHID } = require('../config/config')
const router = express.Router()
const adauth = require('../middleware/adauth')
const Applicant = require('../model/Applicant')
const Admin = require('../model/Admin')
const Notification = require('../model/Notification')
const Resources =require('../model/Resources')
const Company = require('../model/Company')
const cookieParser = require('cookie-parser')
router.use(cookieParser())


router.get('/homepage', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../views/index.html'))
})

router.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/login.html'))
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

router.get('/viewcandidates', adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../views/admin/Aviewapplicants.html'))
})

router.get('/announcements',adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname,'../views/admin/AAnnouncement.html'))
})
router.get('/resources',adauth, (req, res) => {
  res.sendFile(path.resolve(__dirname,'../views/admin/Aresources.html'))
})

router.get('/getMsgList', adauth,  async (req,res) =>{
  let toBeAdded;
  const notificationList = []
  try{
    let notification = await Notification.find()
    notification.forEach(element => {
      toBeAdded = {
        msgto : element.messageto,
        message : element.announcement,
        date : element.createdAt
      }
      notificationList.push(toBeAdded)
    });
  }  
  catch(e){
    console.log(e);
    res.json({
      msg : "error occured"
    })
  }
  res.json({
    result : notificationList,
    msg : "get message list is working"
  })
})

router.get('/getResList', adauth,  async (req,res) =>{
  let toBeAdded;
  const resourcesList = []
  try{
    let resources = await Resources.find()
    resources.forEach(element => {
      toBeAdded = {
        topic : element.topic,
        content : element.content,
        
      }
      resourcesList.push(toBeAdded)
    });
  }  
  catch(e){
    console.log(e);
    res.json({
      msg : "error occured"
    })
  }
  res.json({
    result : resourcesList,
    msg : "get resources list is working"
  })
})


router.get('/candidateslist/:id', async (req, res) => {
  try {
    const _id = req.params.id
    let company = await Company.findOne({
      _id
    })
    if(!company){
      res.json({
        error : true,
        msg : "No company found"
      });
    }
    const candidateList = company.candidates
    const toBeSent = []
    const length = candidateList.length
    for ( i = 0; i<length ; i++){
      let _id = candidateList[i].candidateID;
      try{
        const candidate = await Applicant.findOne({
          _id
        })
        let status = true;
        if(candidateList[i].status === "pending"){
          status = false
        }
        let toBeAdded = {
          candidateID : _id,
          candidateName : candidate.fullname,
          candidateResume : candidate.resume,
          candidateStatus : status
        }
        toBeSent.push(toBeAdded)
      }
      catch(e){
        console.log(e);
      }
    }

    res.json({
      result : toBeSent,
      error : false,
      msg : "Candidate info is successful"
    })
  } catch (e) {
    res.json({
      error : true,
      msg : "Error happend"
    })
  }
})

router.get('/reclist', adauth, async (req, res) => {
  try {
    let listComp = await Company.find()
    res.json(listComp)
  } catch (e) {
    res.status(400).json({
      error: true,
      msg: 'Could not fetch data, sorry :('
    })
  }
})

router.post('/getPreload', adauth, async (req, res) => {
  try {
    const _id = req.body.compID
    let company = await Company.findOne({
      _id
    })
    if (company) {
      res.status(200).json({
        error: false,
        companyname: company.companyname,
        website: company.website,
        package: company.package
      })
    }
    else{
      res.status(400).json({
        error: true,
        msg : "Could not find company"
      })
    }
  } catch (e) {
    console.log(e)
    res.status(400).json({
      error: true,
      msg : "Could not edit company"
    })
  }

})

//put
router.put('/editCompany', adauth, async (req, res) => {
  const { compID, compName, package, website } = req.body

  const _id = compID
  try {
    let company = await Company.findOne({
      _id
    })
    if (!company) {
    }
    company.companyname = compName
    company.website = website
    company.package = package
    company.save()
    res.json({
      error: false,
      msg: 'Company details edited successfully'
    })
  } catch (e) {
    res.json({
      error: true,
      msg: "Error happend, couldn't edit"
    })
  }
})

router.put('/editStatus', async (req, res) => {
  const listOfStudents = req.body.result;
  const _id = req.body.compID;
  try{
    let company = await Company.findOne({
      _id
    })
    if(company){
      let toBeCandidateList = []
      listOfStudents.forEach(element => {
        let status = "pending"
        if(element.status){
          status = "accepted"
        }
        let toBeItemOfCandidateList = {
          candidateID : element.studentId,
          status : status
        }
        toBeCandidateList.push(toBeItemOfCandidateList)
      });
      company.candidates = toBeCandidateList;
      company.save()
    }
    else{
      throw err
    }
    
  }catch(e){
    res.json({ 
      msg : "Status failed be update, try again"
    })
  }
  res.json({
    msg : "Status updated successfully"
  })
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
  const { email, password } = req.body
  try {
    let admin = await Admin.findOne({
      email
    })
    if (!admin) {
      return res.status(400).json({
        message: 'User Not Exist'
      })
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
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
        res.status(200).json({
          adminId: admin.id,
          adminEmail: admin.email,
          token: token
        })
      }
    )
  } catch (e) {
    res.status(500).json({
      message: 'Server Error'
    })
  }
})

router.post('/notifications', adauth, async (req, res) => {
  try {
    const { messageto, announcement } = req.body
    let notification = new Notification({
      messageto,
      announcement
    })
    await notification.save()
    res.status(200).json({
      error: false,
      message: 'Data saved!'
    })
  } catch (e) {
    res.status(400).json({
      error: true,
      message: 'Could not save data!'
    })
  }
})
router.post('/resource', adauth, async (req, res) => {
  try {
    const { topic, content } = req.body
    let resources = new Resources({
      topic,
      content
    })
    await resources.save()
    res.status(200).json({
      error: false,
      message: 'Data saved!'
    })
  } catch (e) {
    res.status(400).json({
      error: true,
      message: 'Could not save data!'
    })
  }
})
router.post('/companies', adauth, async (req, res) => {
  try {
    const { companyname, website, package, cutoff } = req.body
    const candidates = []
    company = new Company({
      companyname,
      website,
      package,
      cutoff,
      candidates
    })
    await company.save()
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