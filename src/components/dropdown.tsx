import React, { useState, useEffect, useRef } from "react";

interface DropdownProps {
  label: any;
  options: {
    value: string;
    icon: string;
  }[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleOptionClick = (option: any) => {
    onSelect(option);
    closeDropdown();
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      closeDropdown();
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div
      className="relative 	 text-left flex flex-col justify-start items-center"
      ref={dropdownRef}
    >
      <div>
        <button
          type="button"
          className="inline-flex  justify-between items-center gap-3 w-64 rounded-md px-6 py-3 bg-gradient-to-r from-purple to-green text-sm font-medium text-black bg-gray-200 hover:bg-gray-100 "
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={toggleDropdown}
        >
          {label?.icon} {label?.value}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute z-50  mt-14 w-64 rounded-b-lg shadow-lg bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div
            className="divide-y divide-slate-400"
            role="menu"
            aria-orientation="vertical"
          >
            {options.map((option) => (
              <button
                key={option.value}
                className={`${
                  selectedOption === option.value
                    ? "bg-neutral-800 text-white"
                    : ""
                } w-64 flex gap-3 items-center text-left 	 px-4 py-3 text-sm hover:bg-neutral-800 last:rounded-b-lg hover:text-white transition-all`}
                role="menuitem"
                onClick={() => handleOptionClick(option)}
              >
                {option.icon} {option.value}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
