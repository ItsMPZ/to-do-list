import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { useAppContext } from '../../context/appContext'
import {
  FormRow,
  Alert
} from '../../components'

function AddTask() {
  
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    subject,
    caption,
    owner,
    handleChange,
    clearValues,
    createTask,
    editTask,
    employees,
    user
  } = useAppContext()

  const handleTaskInput = e => {
    const { name, value } = e.target
    handleChange({ name, value })
  }

  const handleSubmit = e => {
    e.preventDefault()

    if(!subject){
      displayAlert()
      return
    }

    if(isEditing){
      editTask()
      return
    }

    createTask()
  }

  let employeesOptions = []

  if(user.role === 'company' && employees){
    employeesOptions = employees.map((item, index) => {
      return(
        <option key={index} value={item._id}>
          {`${item.name} ${item.lastName}`}
        </option>
      )}
    )
  }

  return (
    <Wrapper>
      <form className='from'>
        <h3>{isEditing? 'edit task': 'add task'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          {/* subject */}
          <FormRow
            type='text'
            name='subject'
            value={subject}
            handleChange={handleTaskInput}
          />
          {/* caption */}
          <FormRow
            type='text'
            name='caption'
            value={caption}
            handleChange={handleTaskInput}
          />
          {/* select owner (only for companies) */}
          {user.role === 'company' && <div className='form-row'>
            <label htmlFor='owner' className='form-label'>
              owner
            </label>
            <select
              name='owner'
              value={owner}
              onChange={handleTaskInput}
              className='form-select'
            >
              <option value=''>
                {user.name}
              </option>
              {employeesOptions}  
            </select>
          </div>}
          {/* btn */}
          <div className='btn-container'>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className='btn btn-block clear-btn'
              onClick={e => {
                e.preventDefault()
                clearValues()
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddTask