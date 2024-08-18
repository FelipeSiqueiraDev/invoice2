export type InvoiceDTO = {
  Chave: string;
  DanfeFilePath: string;
  EmissaoDt: string;
  EmpresaId: number;
  FornecedorId: string;
  Id: string;
  InsertDate: string;
  InsertStatusId: number;
  InsertUserId: number;
  ManifestacaoDt: string;
  ManifestacaoStatusId: number;
  ManifestacaoUserPending: boolean;
  Modelo: string;
  NaturezaOperacao: string;
  Numero: string;
  PDFFileExists: boolean;
  Serie: string;
  StatusId: number;
  TotalFaturasDescontoVlr: number;
  TotalFaturasLiquidoVlr: number;
  TotalFaturasOriginalVlr: number;
  TotalNfVlr: number;
  TotalProdutosVlr: number;
  XMLFileExists: boolean;
  XmlFileModificacaoDt: string;
  XmlFilePath: string;
  Image?: string[];
  type?: string;
};

export type lastInvoicesDTO = {
  Chave: string;
  CheckPuxadaDt: string;
  CheckPuxadaMotoristaCPF: string;
  CheckPuxadaPlaca: string;
  CheckPuxadaUserId: number;
  DanfeFilePath: string;
  EmissaoDt: string;
  EmpresaId: number;
  FornecedorId: string;
  Id: string;
  ImagePath: string;
  InsertDate: string;
  InsertStatusId: number;
  InsertUserId: number;
  ManifestacaoDt: string;
  ManifestacaoStatusId: number;
  ManifestacaoUserPending: boolean;
  Modelo: string;
  NaturezaOperacao: string;
  Numero: string;
  Serie: string;
  StatusId: number;
  TotalFaturasDescontoVlr: number;
  TotalFaturasLiquidoVlr: number;
  TotalFaturasOriginalVlr: number;
  TotalNfVlr: number;
  TotalProdutosVlr: number;
  UpdateDate: string;
  UpdateUserId: number;
  XmlFileModificacaoDt: string;
  XmlFilePath: string;
};
