import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client/react";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );

  const client = useApolloClient();

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setPage("authors");
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      {page === "authors" && <Authors token={token} />}

      {page === "books" && <Books />}

      {page === "add" && token && <NewBook />}

      {page === "login" && !token && (
        <LoginForm setPage={setPage} setToken={setToken} />
      )}
    </div>
  );
};

export default App;
