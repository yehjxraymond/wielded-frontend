import {
  FunctionComponent,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useEffect } from "react";
import localforage from "localforage";

interface UTMParameters {
  [key: string]: string;
}

interface StoredUTMParameters {
  params: UTMParameters;
  timestamp: number;
}

interface UTMContextProps {
  getUTMParameters: () => Promise<UTMParameters>;
}

const EXPIRY_DURATION = 2 * 7 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds

const UTMContext = createContext<UTMContextProps | undefined>(undefined);

export const useUTMParameters = (): UTMContextProps => {
  const context = useContext(UTMContext);
  if (!context) {
    throw new Error("useUTMParameters must be used within a UTMProvider");
  }
  return context;
};

export const UTMProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const getUTMParameters = useMemo(
    () => async () => {
      const storedData: StoredUTMParameters | null =
        (await localforage.getItem("utm_parameters")) || null;
      const currentParams = new URLSearchParams(window.location.search);
      const currentUTMParams: UTMParameters = {};

      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
      ].forEach((param) => {
        const value = currentParams.get(param);
        if (value) {
          currentUTMParams[param] = value;
        }
      });

      // If there's new UTM params in the URL, save them
      if (Object.keys(currentUTMParams).length > 0) {
        const updatedData = { params: currentUTMParams, timestamp: Date.now() };
        await localforage.setItem("utm_parameters", updatedData);
        return currentUTMParams;
      }

      // If no new params & stored data exists and not expired, return stored data
      if (storedData && Date.now() - storedData.timestamp <= EXPIRY_DURATION) {
        return storedData.params;
      }

      // If no new params & no stored data or stored data expired, return empty object
      return {};
    },
    []
  );

  useEffect(() => {
    // The method gets invoked here to ensure check and save of UTM params every time a user lands
    getUTMParameters();
  }, [getUTMParameters]);

  return (
    <UTMContext.Provider value={{ getUTMParameters }}>
      {children}
    </UTMContext.Provider>
  );
};
