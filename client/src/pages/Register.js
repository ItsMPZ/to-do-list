import { useState, useEffect } from 'react'
import { Logo, FormRow, Alert } from "../components"
import FormRowSelect from '../components/FormRowSelect'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from "../context/appContext"
import { useNavigate } from "react-router-dom"

const initialState = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  role: 'none',
  worksFor: 'Please select a company',
  worksForID: '',
  isMember: true
}

function Register() {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialState)
  const {
    user,
    isLoading,
    showAlert,
    displayAlert,
    setupUser,
    roleOptions,
    companies,
    getCompanies
  } = useAppContext()

  const companiesName = companies.map(company => {
    return company.name
  })

  const toggleMember = () => {
    setValues({
      ...values,
      isMember: !values.isMember
    })
  }

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const worksForhandleChange = e => {
    let selectedCompanyName = e.target.value

    for (let i = 0; i < companies.length; i++) {
      if(companies[i].name === selectedCompanyName){
        setValues({
          ...values,
          worksForID: companies[i]._id,
          worksFor: selectedCompanyName
        })
      }
    }

  }

  const onSubmit = e => {
    e.preventDefault()

    const { name, lastName, email, password, role, isMember, worksFor, worksForID } = values

    if (!email || !password || (!isMember && !name) || (!isMember && role !== 'company' && !lastName)) {
      displayAlert()
      return
    }

    if(!isMember && role === 'employee' && worksFor === 'Please select a company'){
      displayAlert()
      return
    }
    
    let currentUser
    switch (role) {
      case 'company':
        currentUser = {
          name,
          email,
          password,
          role
        }
        break;
      case 'employee':
        currentUser = {
          name,
          lastName,
          email,
          password,
          role,
          worksFor: worksForID
        }
        break;
      case 'none':
        currentUser = {
          name,
          lastName,
          email,
          password,
          role
        }
        break;
      default:
        break;
    }

    if(isMember) {
      setupUser({
        currentUser,
        endPoint: 'login',
        alertText: 'Login Successful! Redirecting...'
      })
    } else {
      setupUser({
        currentUser,
        endPoint: 'register',
        alertText: 'User Created! Redirecting...'
      })
    }
  }
  
  useEffect(() => {
    getCompanies()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }
  }, [user, navigate])

  

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}
        {/* name input */}
        {!values.isMember && (
          <FormRow
            type='text'
            name='name'
            value={values.name}
            handleChange={handleChange}
          />
        )}
        {/* last name input */}
        {!values.isMember && values.role !== 'company' && (
          <FormRow
            type='text'
            name='lastName'
            labelText='last name'
            value={values.lastName}
            handleChange={handleChange}
          />
        )}
        {/* email input */}
        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange}
        />
        {/* password input */}
        <FormRow
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange}
        />
        {/* role select */}
        {!values.isMember && <FormRowSelect
          name='role'
          value={values.role}
          handleChange={handleChange}
          list={roleOptions}
        />}
        {/* works for select */}
        {!values.isMember && values.role === 'employee' && <FormRowSelect
          name='worksFor'
          labelText='working for'
          value={values.worksFor}
          handleChange={worksForhandleChange}
          list={['Please select a company', ...companiesName]}
        />}
        <button
          type='submit'
          className='btn btn-block'
          disabled={isLoading}
        >
          submit
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button
            type='button'
            onClick={toggleMember}
            className='member-btn'
          >
            {values.isMember ? 'Register' : "Login"}
          </button>
          
        </p>
      </form>
    </Wrapper>
  )
}

export default Register