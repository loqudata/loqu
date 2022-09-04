// https://stackoverflow.com/questions/11876175/how-to-get-a-file-or-blob-from-an-object-url

/** An object that represents a Web File API object, that can be serialized and recreated within one browser session. Useful for storing File object references in a state management library. */
export interface IFile {
  /** The object URL created with URL.createObjectURL; looks like blob:http://localhost:3000/28f455a6-d3aa-4f86-a802-ede43413b445 */
  objectURL: string;

  name: string;
  lastModified: number;
}

export function serialize(file: File): IFile {
  return {
    objectURL: URL.createObjectURL(file),
    name: file.name,
    lastModified: file.lastModified,
  };
}

export async function deserialize(fileObject: IFile): Promise<File> {
  const data = await (
    await fetch(
      "blob:http://localhost:3000/28f455a6-d3aa-4f86-a802-ede43413b445"
    )
  ).blob();
  return new File([data], fileObject.name, {
    lastModified: fileObject.lastModified,
  });
}
