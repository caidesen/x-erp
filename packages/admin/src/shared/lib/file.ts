export function getFileUrl(id?: string, ext?: string) {
  if (!id) return "";
  if (!ext) return `/file/${id}`;
  return `/file/${id}.${ext}`;
}
