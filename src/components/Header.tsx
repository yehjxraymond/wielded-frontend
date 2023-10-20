import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <nav className="w-full flex container justify-between my-5">
      <div className="font-semibold text-xl">wielded_</div>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};
