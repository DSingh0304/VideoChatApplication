import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboradingPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import NotificationPage from "./pages/NotificationPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  //tanstack query
  //We use query when we want to fetch some data for get req
  //Use mutations when you want to delete aor post aor put req
  //axios is for updating the data

  const { isLoading, authUser } = useAuthUser();

  const {theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.user.isOnBoarded;
  console.log(authUser);
  console.log(isOnboarded);

  //using zustand for global context

  if (isLoading) return <PageLoader />;

  return (
    <>
      <div className="h-screen" data-theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                <HomePage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <SignUpPage /> : <Navigate to={ isOnboarded ? "/" : "/onboarding" } />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to={ isOnboarded ? "/" : "/onboarding" } />}
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                <NotificationPage />
                </Layout>
              ) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)
            }
          />
          <Route
            path="/call"
            element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat/:id"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={false}>
                <ChatPage />
                </Layout>
              ) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)}
          />
          <Route
            path="/onboarding"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" />
              ) : !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>

        <Toaster />
      </div>
    </>
  );
};

export default App;
