import { useAppContext } from '../context/appContext'
import StatItem from './StatItem'
import { VscCheck, VscChromeClose } from 'react-icons/vsc'
import Wrapper from '../assets/wrappers/StatsContainer'

const StatsContainer = () => {
    const { stats } = useAppContext()

    const defaultStats = [
        {
          title: 'done tasks',
          count: stats.done || 0,
          icon: <VscCheck />,
          color: '#6dcb64',
          bcg: '#e3f9e0',
        },
        {
          title: 'not done tasks',
          count: stats.notDone || 0,
          icon: <VscChromeClose />,
          color: '#d66a6a',
          bcg: '#ffeeee',
        }
    ]
    return (
        <Wrapper>
            {defaultStats.map((item, index) => {
                return <StatItem key={index} {...item} />
            })}
        </Wrapper>
    )
}

export default StatsContainer