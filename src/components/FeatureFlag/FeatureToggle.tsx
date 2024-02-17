import React, { ReactNode, ReactElement } from "react";

type FeatureToggleWithChildrenProps = {
  toggle: boolean;
  children: ReactNode;
};

type FeatureToggleWithRenderProps = {
  toggle: boolean;
  renderOn?: () => ReactElement;
  renderOff?: () => ReactElement;
};

export type FeatureToggleProps =
  | FeatureToggleWithChildrenProps
  | FeatureToggleWithRenderProps;

const isWithChildren = (
  prop: FeatureToggleProps
): prop is FeatureToggleWithChildrenProps => {
  return (prop as FeatureToggleWithChildrenProps).children !== undefined;
};

export const FeatureToggle: React.FC<FeatureToggleProps> = (prop) => {
  const { toggle } = prop;

  if (isWithChildren(prop)) {
    return toggle ? <>{prop.children}</> : null;
  }

  const { renderOn, renderOff } = prop;

  return toggle ? renderOn?.() : renderOff?.();
};
