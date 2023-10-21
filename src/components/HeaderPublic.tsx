import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export const HeaderPublic = () => {
  return (
    <nav className="w-full flex container justify-between my-5">
      <Link href="/">
        <div className="font-semibold text-xl">wielded_</div>
      </Link>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};
