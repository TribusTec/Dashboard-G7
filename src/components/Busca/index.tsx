// components/SearchInput.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  id?: string; 
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, label, id = "search-input" }) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <Label htmlFor={id} className="mb-3 block">
          {label}
        </Label>
      )}
      <Input
        id={id}
        type="text"
        placeholder="Pesquisar por nome"
        value={value}
        onChange={onChange}
        className="w-full"
      />
    </div>
  );
};

export default SearchInput;
