import { BrowserRouter, Routes, Route } from 'react-router-dom'

import {
  Error,
  Landing,
  ProtectedRoute,
  Register
} from "./pages"

import {
  AddTask,
  AllTasks,
  Profile,
  SharedLayout,
  Stats
} from "./pages/dashboard"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Stats />} />
            <Route path='all-tasks' element={<AllTasks />} />
            <Route path='add-task' element={<AddTask />} />
            <Route path='profile' element={<Profile />} />
          </Route>
          <Route path='/register' element={<Register />} />
          <Route path='/Landing' element={<Landing />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
