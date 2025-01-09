import "./Home.css";

export default function Home({ children }) {
  return (
    <div className="home-cont">
      <div className="container text-center">
        <h1 className="display-4 text-white">Home</h1>
        {children}
      </div>
    </div>
  );
}
