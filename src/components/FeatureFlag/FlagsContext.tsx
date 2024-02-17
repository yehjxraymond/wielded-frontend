import { LOCALSTORAGE, createInstance } from "localforage";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const flagStore = createInstance({
  name: "feature-flags",
  driver: LOCALSTORAGE,
});

const FLAG_KEY = "flags";

type Flag = {
  id: string;
  isActive: boolean;
};

type FlagsContextType = {
  flags: Flag[];
  setFlags: (flags: Flag[]) => void;
};

export const FlagsContext = createContext<FlagsContextType | undefined>(
  undefined
);

export const FlagsProvider: React.FC<{
  children: ReactNode;
  initialFlags?: Flag[];
  localStorageOverride?: boolean;
  debug?: boolean;
}> = ({ children, initialFlags = [], localStorageOverride, debug }) => {
  const [baseFlags, setFlagsState] = useState<Flag[]>(initialFlags);
  const [override, setOverride] = useState<Flag[]>([]);
  const flags = [...baseFlags, ...override].reduce((acc, flag) => {
    const existingFlag = acc.find((f) => f.id === flag.id);
    if (existingFlag) {
      return acc;
    } else {
      return [...acc, flag];
    }
  }, [] as Flag[]);

  // Load flags from local storage or other initial sources
  useEffect(() => {
    if (localStorageOverride) {
      // Example of how to override in browser local storage:
      // localStorage.setItem("feature-flags/flags", JSON.stringify([{id: "test", isActive: true}]));
      flagStore.getItem<Flag[]>(FLAG_KEY).then((value) => {
        if (value) {
          if (debug) {
            console.info("Loaded flags from local storage");
            console.info(value);
          }
          setOverride(value);
        }
      });
    }
  }, [localStorageOverride, debug]);

  const setFlags = (newFlags: Flag[]) => {
    setFlagsState((prevFlags) => {
      const updatedFlags = [...prevFlags];
      newFlags.forEach((flag) => {
        const index = updatedFlags.findIndex((f) => f.id === flag.id);
        if (index !== -1) {
          updatedFlags[index] = flag;
        } else {
          updatedFlags.push(flag);
        }
      });
      return updatedFlags;
    });
  };

  return (
    <FlagsContext.Provider value={{ flags: flags, setFlags }}>
      {children}
    </FlagsContext.Provider>
  );
};

export const useFlags = () => {
  const context = useContext(FlagsContext);
  if (!context) {
    throw new Error("useFlags must be used within a FlagsProvider");
  }
  return context;
};

export const useFlaggedActive = (
  flagIds: string[],
  allFlagsMustBeActive = false
): boolean => {
  const { flags } = useFlags();

  if (allFlagsMustBeActive) {
    // All flags in flagIds array must be active
    return flagIds.every((flagId) =>
      flags.some((flag) => flag.id === flagId && flag.isActive)
    );
  } else {
    // At least one flag in flagIds array must be active
    return flagIds.some((flagId) =>
      flags.some((flag) => flag.id === flagId && flag.isActive)
    );
  }
};
