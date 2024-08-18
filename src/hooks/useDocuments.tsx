import { useContext } from "react";

import { DocumentContext } from "@contexts/DocumentsContext";

export function useDocument() {
  const context = useContext(DocumentContext);
  return context;
}
