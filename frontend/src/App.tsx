import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import OnboradingPage from "./pages/OnboradingPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import NotificationPage from "./pages/NotificationPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";

const App = () => {
  //tanstack query
  //We use query when we want to fetch some data for get req
  //Use mutations when you want to delete aor post aor put req
  //axios is for updating the data

  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false, //auth check
  });

  const authUser = authData?.user;

  return (
    <>
      <div className="h-screen" data-theme="night">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/call"
            element={authUser ? <CallPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat"
            element={authUser ? <ChatPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/onboarding"
            element={authUser ? <OnboradingPage /> : <Navigate to="/login" />}
          />
        </Routes>

        <Toaster />
      </div>
    </>
  );
};

export default App;
