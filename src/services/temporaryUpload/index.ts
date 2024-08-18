import { api } from "@services/api";

import { AxiosRequestConfig } from "axios";

export async function temporaryUpload(uri: string) {
  try {
    const formData = new FormData();

    const filename = uri.split("/").pop();

    const match = /\.(\w+)$/.exec(filename!);
    const type = match ? `image/${match[1]}` : `image`;
    // @ts-ignore
    formData.append("Files", { uri, name: filename, type });

    const options: AxiosRequestConfig<FormData> = {
      method: "post",
      url: "/File/TemporaryUpload",
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
    };

    const { data } = await api(options);

    return data.TemporaryFile;
  } catch (error) {
    console.log(error);
    throw new Error("Algo deu errado ao enviar foto.");
  }
}

export async function uploadAllImages(images: string[]) {
  const temporaryUploadPromises: Promise<string>[] = [];

  for (const uri of images) {
    temporaryUploadPromises.push(temporaryUpload(uri));
  }

  const uploadResults = await Promise.all(temporaryUploadPromises);

  const formated = uploadResults.map((filename) => ({
    OriginalName: filename.split("/").pop() || "",
    Filename: filename,
  }));

  return formated;
}
