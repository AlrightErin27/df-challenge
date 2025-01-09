import "./Home.css";

export default function Home({ children }) {
  return (
    <div className="home-cont">
      <div className="container text-center py-4">
        <div className="header-container mb-3">
          <h1 className="display-4 fw-bold text-white">Clarity</h1>
          <h3 className="text-light">Your Path to Organization</h3>
        </div>

        <div className="content-container p-4 bg-transparent border rounded-3 shadow">
          {children}
        </div>

        <footer className="mt-4">
          <p className="text-muted">
            Built for simplicity, powered by Clarity
            <br />
            Created by Erin Van Brunt, Software Engineer &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
