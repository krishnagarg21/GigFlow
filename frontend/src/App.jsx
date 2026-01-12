import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchMe } from "./redux/slices/authSlice";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import CreateGig from "./pages/CreateGig";
import GigDetail from "./pages/GigDetail";
import Navbar from "./components/Navbar";
import MyGigs from "./pages/MyGigs";
import MyBids from "./pages/MyBids";
import AppLayout from "./components/AppLayout";


function App() {
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);


  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }


  <div className="bg-red-500 text-white p-10 text-3xl">
    TAILWIND TEST
  </div>



  return (
    <>
      <Navbar/>
      
      <AppLayout>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/gigs" /> : <Login />}
          />

          <Route
            path="/register"
            element={user ? <Navigate to="/gigs" /> : <Register />}
          />
          <Route
            path="/gigs"
            element={user ? <Gigs /> : <Navigate to="/login" />}
          />
          <Route path="/create-gig" element={user ? <CreateGig /> : <Navigate to="/login" />} />
          <Route path="/gigs/:id" element={user ? <GigDetail /> : <Navigate to="/login" />} />
          <Route path="/my-gigs" element={<MyGigs />} />
          <Route path="/my-bids" element={user ? <MyBids /> : <Navigate to="/login" />} />
          <Route
            path="*"
            element={<Navigate to={user ? "/gigs" : "/login"} />}
          />
        </Routes>
      </AppLayout>
    </>
  );
}

export default App;
