import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";

const BirthYearForm = ({ authors }) => {
  const [name, setName] = useState(authors[0].name);
  const [birthYear, setBirthYear] = useState(authors[0].born || "");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const setBornTo = Number(birthYear);
    if (!setBornTo || Number.isNaN(setBornTo)) return;

    editAuthor({ variables: { name, setBornTo } });

    setName(authors[0].name);
    setBirthYear(String(authors[0].born) || "");
  };

  return (
    <div>
      <h3>set birth year</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            name
            <select
              value={name}
              onChange={({ target }) => {
                setName(target.value);
                setBirthYear(
                  authors.find((a) => a.name === target.value).born || "",
                );
              }}
            >
              {authors.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
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

export default BirthYearForm;
