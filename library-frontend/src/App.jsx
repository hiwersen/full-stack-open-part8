import { useState } from "react";
import Notification from "./components/Notification";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommendations from "./components/Recommendations";
import LoginForm from "./components/LoginForm";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import { BOOK_ADDED } from "./queries.js";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );
  const [notification, setNotification] = useState(null);
  const [timeoutID, setTimeoutID] = useState(null);

  const client = useApolloClient();

  const notify = (notification) => {
    timeoutID && clearTimeout(timeoutID);

    setNotification(notification);

    const ID = setTimeout(() => {
      setNotification(null);
      setTimeoutID(null);
    }, 5000);
    setTimeoutID(ID);
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const { bookAdded } = data.data;
      notify(`${bookAdded.title} added`);
    },
  });

  const handleLogout = () => {
    localStorage.clear();
    client.resetStore();
    setPage("authors");
    setToken(null);
    notify("logged out");
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Notification notification={notification} />

      {page === "authors" && <Authors token={token} />}

      {page === "books" && <Books />}

      {page === "add" && token && <NewBook />}

      {page === "recommend" && token && <Recommendations />}

      {page === "login" && !token && (
        <LoginForm setPage={setPage} setToken={setToken} notify={notify} />
      )}
    </div>
  );
};

export default App;
