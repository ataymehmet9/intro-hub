export default function getLastPath(path: string, delimiter: string = '/') {
  return path.split(delimiter).pop() || ''
}
