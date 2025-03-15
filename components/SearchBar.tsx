import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm(""); // ✅ Reset input field
    onSearch(""); // ✅ Reset the search state
  };

  return (
    <Form onSubmit={handleSearch} className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search AI tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <Button type="submit" variant="primary">🔍 Search</Button>
        {searchTerm && (
          <Button type="button" variant="secondary" onClick={handleClear}>❌ Clear</Button>
        )}
      </InputGroup>
    </Form>
  );
};

export default SearchBar;
