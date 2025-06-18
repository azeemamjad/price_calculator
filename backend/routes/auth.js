import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, role } = req.body

    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      firstName: firstname,
      lastName: lastname,
      username,
      email,
      password: hashedPassword,
      role: role || 'customer' // default to 'customer' if no role provided
    })

    await newUser.save()

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role 
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
