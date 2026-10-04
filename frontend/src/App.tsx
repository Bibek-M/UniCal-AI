import { Route, Routes } from "react-router-dom";
import Home from './pages/Home'
import PageNotFound from "./pages/PageNotFound";
import StudentSignIn from "./pages/StudentSignIn";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/signin" element={<StudentSignIn/>} />
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </div>
  )
}

export default App