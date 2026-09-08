import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";

const SetBirthYear = () => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const setBornTo = Number(birthYear);
    if (!setBornTo || Number.isNaN(setBornTo)) return;

    editAuthor({ variables: { name, setBornTo } });

    setName("");
    setBirthYear("");
  };

  return (
    <div>
      <h3>set birth year</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            name
            <input
              value={name}
              onChange={({ target }) => {
                setName(target.value);
              }}
            />
          </label>
        </div>
        <div>
          <label>
            born
            <input
              value={birthYear}
              onChange={({ target }) => {
                setBirthYear(target.value);
              }}
            />
          </label>
        </div>
        <div>
          <button type="submit">update author</button>
        </div>
      </form>
    </div>
  );
};

export default SetBirthYear;
