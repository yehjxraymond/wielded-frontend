import React, { ReactElement, ReactNode } from "react";
import { FeatureToggle } from "./FeatureToggle";
import { useFlags } from "./FlagsContext";

type FeatureFlagWithChildrenProps = {
  flags: string[];
  allFlagsPresent?: boolean;
  children: ReactNode;
};

type FeatureFlagWithRenderProps = {
  flags: string[];
  allFlagsPresent?: boolean;
  renderOn?: () => ReactElement;
  renderOff?: () => ReactElement;
};

export type FeatureFlagProps =
  | FeatureFlagWithChildrenProps
  | FeatureFlagWithRenderProps;

export const FeatureFlag: React.FC<FeatureFlagProps> = ({
  flags,
  allFlagsPresent,
  ...toggleProps
}) => {
  const { flags: availableFlags } = useFlags();

  const toggle = allFlagsPresent
    ? flags.every((flag) => {
        const foundFlag = availableFlags.find((f) => f.id === flag);
        return foundFlag ? foundFlag.isActive : false;
      })
    : flags.some((flag) => {
        const foundFlag = availableFlags.find((f) => f.id === flag);
        return foundFlag ? foundFlag.isActive : false;
      });

  return <FeatureToggle {...toggleProps} toggle={toggle} />;
};
