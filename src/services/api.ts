import axios from "axios";

export const api = axios.create({
  baseURL: "http://gestao.faridnet.com.br/", // PRODUÇÃO
  // baseURL: "http://172.26.80.1:51044/", // TESTES
  timeout: 30000,
  timeoutErrorMessage: "Tempo limite atingido. Sem resposta do servidor",
});
