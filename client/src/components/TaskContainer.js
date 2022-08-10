import { useAppContext } from '../context/appContext'
import { useEffect } from 'react'
import Loading from './Loading'
import Task from './Task'
import Wrapper from '../assets/wrappers/JobsContainer'
import PageBtnContainer from './PageBtnContainer'

const TaskContainer = () => {
    const {
        getTasks,
        tasks,
        isLoading,
        totalTasks,
        numOfPages,
        page
    } = useAppContext()

    useEffect(() => {
        getTasks()
        // eslint-disable-next-line
    },[page])

    if(isLoading){
        return <Loading center />
    }

    if(tasks.length === 0){
        return (
            <Wrapper>
                <h2>No tasks to display...</h2>
            </Wrapper>
        )
    }

  return (
    <Wrapper>
        <h5>
            {totalTasks} task{tasks.length > 1 && 's'} found
        </h5>
        <div className='jobs'>
            {tasks.map (task => {
                return <Task key={task._id} {...task} />
            })}
        </div>
        {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  )
}

export default TaskContainer