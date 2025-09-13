

import UserLogin from './pages/UserLogin';
import UserSignup from './pages/Signup';
import Homepage from './pages/Homepage';
import Goalspage from './pages/Goalspage';
import Roadmap from './pages/Roadmap';
import { BrowserRouter , Route , Routes } from 'react-router-dom';

// import { useAuth  } from './contexts/authContext/page';

function App() {
//  const {isUserLoggedin , currentUser} = useAuth()
  return (
    <>
   <BrowserRouter>
   
   <Routes>
    <Route path='/Homepage' element={<Homepage />}></Route>
    <Route path='/Login' element={<UserLogin />} />
    <Route path='/Signup' element={<UserSignup />}></Route>
    <Route path='/createGoals' element={<Goalspage />}></Route>
    <Route path='/roadmap' element={<Roadmap />}></Route>
   </Routes>

   </BrowserRouter>
   

    </>
  )
}

export default App;
