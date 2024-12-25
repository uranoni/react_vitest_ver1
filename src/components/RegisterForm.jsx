import { useState } from 'react'
import PropTypes from 'prop-types'

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthYear: '',
    isSingle: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      setFormData({
        name: '',
        birthYear: '',
        isSingle: false
      })
    } catch (error) {
      console.error('提交表單時發生錯誤:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group">
        <label htmlFor="name">姓名：</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          data-testid="name-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="birthYear">出生年份：</label>
        <input
          type="number"
          id="birthYear"
          name="birthYear"
          value={formData.birthYear}
          onChange={handleChange}
          required
          data-testid="birthYear-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="isSingle">
          <input
            type="checkbox"
            id="isSingle"
            name="isSingle"
            checked={formData.isSingle}
            onChange={handleChange}
            data-testid="isSingle-checkbox"
          />
          是否單身
        </label>
      </div>

      <button type="submit" data-testid="submit-button">
        提交註冊
      </button>
    </form>
  )
}

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default RegisterForm 