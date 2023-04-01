import { Tooltip } from "@mui/material";
import React from "react";

interface ValueLabelProps {
  children: React.ReactElement;
  value: number;
}

function ValueLabelComponent(props: ValueLabelProps) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}
export default ValueLabelComponent;
