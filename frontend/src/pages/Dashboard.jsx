import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login", {
        replace: true
      });

      return;
    }

    try {
      const parsedUser =
        JSON.parse(savedUser);

      setUser(parsedUser);

    } catch (error) {
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">

      {/* Navbar */}
      <nav className="nav">

        <div className="nav-brand">

          <div className="small-logo">
            N
          </div>

          <span>
            Pandi Selvi Login Page
          </span>

        </div>

        <button
          className="logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

      {/* Dashboard */}
      <main className="dashboard-main">

        <section className="welcome">

          <div className="welcome-icon">
            👋
          </div>

          <h1>
            Welcome, {user.name}!
          </h1>

          <p>
            You have successfully logged in
            to your NexaFlow dashboard.
          </p>

          <div className="user-details">

            <div>
              <span>
                Name
              </span>

              <strong>
                {user.name}
              </strong>
            </div>

            <div>
              <span>
                Email
              </span>

              <strong>
                {user.email}
              </strong>
            </div>

          </div>

        </section>

        <section className="dashboard-grid">

          <div className="dashboard-card">

            <div className="card-icon">
              🔐
            </div>

            <h3>
              Authentication
            </h3>

            <p>
              Your credentials were
              successfully verified.
            </p>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              ⚡
            </div>

            <h3>
              API Connected
            </h3>

            <p>
              React is communicating
              with the Express backend.
            </p>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              🚀
            </div>

            <h3>
              Project Ready
            </h3>

            <p>
              You can add more features
              to your dashboard.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;