import { InvoiceDTO } from "@dtos/InvoiceDTO";
import { createContext, useState } from "react";

export type DocumentContextDataProps = {
  documents: InvoiceDTO[];
  setDocument: React.Dispatch<React.SetStateAction<InvoiceDTO[]>>;
  addDocument: (document: InvoiceDTO) => void;
  removeDocument: (document: InvoiceDTO) => void;
  addImageToDocument: (document: InvoiceDTO, image: string) => void;
  removeImageFromDocument: (
    document: InvoiceDTO,
    imageToRemove: string
  ) => void;
};

export type DocumentProps = {
  type: string | null;
  docCode: string;
};

type DocumentContextProviderProps = {
  children: React.ReactNode;
};
export const DocumentContext = createContext({} as DocumentContextDataProps);

export function DocumentContextProvider({
  children,
}: DocumentContextProviderProps) {
  const [documents, setDocument] = useState<InvoiceDTO[]>([]);

  function addDocument(data: InvoiceDTO) {
    data.Image = [];
    setDocument((prev) => [...prev, data]);
  }

  function removeDocument(data: InvoiceDTO) {
    setDocument((prevDoc) => prevDoc.filter((doc) => doc.Chave !== data.Chave));
  }

  function addImageToDocument(document: InvoiceDTO, image: string) {
    setDocument((prev) => {
      return prev.map((doc) => {
        if (doc.Chave === document.Chave) {
          const updatedImages = doc.Image ? [...doc.Image, image] : [image];
          return { ...doc, Image: updatedImages };
        }
        return doc;
      });
    });
  }

  function removeImageFromDocument(
    document: InvoiceDTO,
    imageToRemove: string
  ) {
    setDocument((prev) => {
      return prev.map((doc) => {
        if (doc.Chave === document.Chave) {
          const updatedImages = doc.Image?.filter(
            (image) => image !== imageToRemove
          );
          return { ...doc, Image: updatedImages || [] };
        }
        return doc;
      });
    });
  }

  return (
    <DocumentContext.Provider
      value={{
        documents,
        setDocument,
        addDocument,
        removeDocument,
        addImageToDocument,
        removeImageFromDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}
