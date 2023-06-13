export const isVideoLink = (link: string): boolean =>  {
    const videoExtensions = [".mp4", ".avi", ".mov", ".flv", ".wmv"];
    return videoExtensions.some(ext => link.endsWith(ext));
}
