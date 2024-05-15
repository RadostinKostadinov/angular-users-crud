export function isLinkActiveIgnoreParams(this: any, url: string): boolean {
  return '/' + this.activatedRoute.snapshot.url.join('/') === url;
}
