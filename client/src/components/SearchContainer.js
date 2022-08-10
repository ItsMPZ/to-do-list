import FormRow from './FromRow'
import FormRowSelect from './FormRowSelect'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'

const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    statusOptions,
    sort,
    sortOptions,
    handleChange,
    clearFilters,
    user,
    employees,
    searchOwner,
    getTasks,
    searchCreatedBy,
    companies,
    
  } = useAppContext()

  const handleSearchInput = (e) => {
    const {name, value} = e.target
    handleChange({ name, value })
  }

  const handleClear = e => {
    e.preventDefault()
    clearFilters()
  }
  const handleSearch = e => {
    e.preventDefault()
    getTasks()
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
      <form className='form'>
        <h4>search form</h4>
        <div className='form-center'>
          <FormRow
            type='text'
            name='search'
            value={search}
            handleChange={handleSearchInput}
          />
          <FormRowSelect
            lableText='status'
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearchInput}
            list={['all', ...statusOptions]}
          />
          <FormRowSelect
            name='sort'
            value={sort}
            handleChange={handleSearchInput}
            list={sortOptions}
          />
          {/* search owner select */}
          {user.role === 'company' && <div className='form-row'>
            <label htmlFor='owner' className='form-label'>
              owner
            </label>
            <select
              name='searchOwner'
              value={searchOwner}
              onChange={handleSearchInput}
              className='form-select'
            >
              <option value=''>
                all
              </option>
              <option value={user._id}>
                {user.name}
              </option>
              {employeesOptions}  
            </select>
          </div>}
          {/* created by select */}
          {user.role === 'employee' && <div className='form-row'>
            <label htmlFor='createdBy' className='form-label'>
              created by
            </label>
            <select
              name='searchCreatedBy'
              value={searchCreatedBy}
              onChange={handleSearchInput}
              className='form-select'
            >
              <option value=''>
                all
              </option>
              <option value={user._id}>
                {user.name}
              </option>
              <option value={user.worksFor}>
                {companies.find(({_id}) => _id === user.worksFor).name}
              </option>
            </select>
          </div>}
          {/* btn */}
          <button
            className='btn btn-block btn-danger'
            disabled={isLoading}
            onClick={handleClear}
          >
            clear filters
          </button>
          <button
            className='btn btn-block search-btn'
            disabled={isLoading}
            onClick={handleSearch}
          >
            search
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default SearchContainer