import moment from 'moment'
import { FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import TaskInfo from './TaskInfo'

const Task = ({
    _id,
    subject,
    caption,
    status,
    createdAt,
    owner,
    createdBy
}) => {

    const {
        setEditTask,
        deleteTask,
        user,
        employees,
        toggleStatus
    } = useAppContext() 

    let date = moment(createdAt)
    date = date.format('MMM Do, YYYY')

    let ownerName = user.name

    if(owner !== user._id){
        const target = employees.find(employee => employee._id === owner)
        ownerName = `${target.name}  ${target.lastName}`
    }

    return (
        <Wrapper>
            <header>
                <div className='main-icon'>{subject.charAt(0)}</div>
                <div className='info'>
                    <h5>{subject}</h5>
                    {user.role === 'company' && <p>{ownerName}</p>}
                </div>
            </header>
            <div className='content'>
                <div className='content-center'>
                    <TaskInfo icon={<FaCalendarAlt />} text={date} />
                    <div className={`status ${status}`}>{status}</div>
                    <p>{<span>Caption: </span>}{caption}</p>
                </div>
                <footer>
                    <div className='actions'>
                        {user._id === owner && <button
                            className='btn toogle-btn'
                            onClick={() => toggleStatus(_id)}
                        >
                            toogle
                        </button>}
                        {user._id === createdBy && <div className='end'>
                            <Link
                                to='/add-task'
                                className='btn edit-btn'
                                onClick={() => setEditTask(_id)}
                            >
                                Edit
                            </Link>
                            <button
                                type='button'
                                className='btn delete-btn'
                                onClick={() => deleteTask(_id)}
                            >
                                Delete
                            </button>
                        </div>}
                    </div>
                </footer>
            </div>
        </Wrapper>
    )
}

export default Task