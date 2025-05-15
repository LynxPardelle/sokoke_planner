export type TColor = {
  bgColor: string;
  textColor: string;
  linkColor: string;
  secondaryBgColor: string;
  secondaryTextColor: string;
  secondaryLinkColor: string;
  accentColor: string;
};
export function isTColor(arg: any): arg is TColor {
  return (
    arg !== 'undefined' &&
    arg.bgColor !== 'undefined' &&
    arg.textColor !== 'undefined' &&
    arg.linkColor !== 'undefined' &&
    arg.secondaryBgColor !== 'undefined' &&
    arg.secondaryTextColor !== 'undefined' &&
    arg.secondaryLinkColor !== 'undefined' &&
    arg.accentColor !== 'undefined'
  );
}
export function isTColorArray(arg: any): arg is TColor[] {
  return Array.isArray(arg) && arg.every((v) => isTColor(v));
}
export function asTColor(arg: any): TColor {
  if (isTColor(arg)) {
    return arg;
  }
  throw new Error('Invalid TColor');
}