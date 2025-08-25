import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    age: '',
    phone: '',
    address: '',
    city: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || 
        !formData.age || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in all fields')
      return
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }

    // Username validation
    if (!/^[a-z-]+$/.test(formData.username)) {
      alert('Username can only contain lowercase letters and dashes')
      return
    }

    // Phone validation
    if (!/^\+\d{1,4}\s\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid phone number with country code (e.g., +91 1234567890)')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true)
        alert('Registration successful!')
        handleReset()
      } else {
        alert(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Registration failed. Please try again.')
    }
  }

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      age: '',
      phone: '',
      address: '',
      city: ''
    })
  }

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>Registration Form</h2>
        
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={(e) => {
              // Only allow lowercase letters and dashes
              const value = e.target.value.toLowerCase();
              if (value === '' || /^[a-z-]*$/.test(value)) {
                handleChange(e);
              }
            }}
            pattern="^[a-z-]+$"
            placeholder="Username (lowercase letters and dashes only)"
            title="Username can only contain lowercase letters and dashes"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number (e.g., +91 1234567890)"
            pattern="^\+\d{1,4}\s\d{10}$"
            title="Please enter country code followed by 10-digit number (e.g., +91 1234567890)"
            required
          />
        </div>

        <div className="form-group">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" onClick={handleReset} className="reset-btn">Reset</button>
        </div>
      </form>
    </div>
  )
}

export default App