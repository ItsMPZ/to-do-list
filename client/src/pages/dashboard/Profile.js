import { useState } from 'react'
import { FormRow, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

function Profile() {
  const {
    user,
    showAlert,
    displayAlert,
    updateUser,
    isLoading
  } = useAppContext()

  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [lastName, setLastName] = useState(user?.lastName)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || (user.role !== 'company' && !lastName)) {
      displayAlert()
      return
    }
    updateUser({ name, email, lastName })
  }

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow
            type='text'
            name='name'
            value={name}
            handleChange={e => setName(e.target.value)}
          />
          {user.role !== 'company' && <FormRow
            type='text'
            labelText='last name'
            name='lastName'
            value={lastName}
            handleChange={e => setLastName(e.target.value)}
          />}
          <FormRow
            type='email'
            name='email'
            value={email}
            handleChange={e => setEmail(e.target.value)}
          />
          <button
            className='btn btn-block'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? 'Please Wait...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Profile