function formatDataSize(length: number, decimals = 2) {
  const bytes = length;
  const kb = bytes / 1024;
  const mb = kb / 1024;

  if (mb >= 1) {
    return `${mb.toFixed(decimals)} MB`;
  } else {
    return `${kb.toFixed(decimals)} KB`;
  }
}

const dhToUsd = 10;

export function costFromUsageDownload(usage: number) {
  //the usage is in bytes
  // return usage by dh
  return Number(usage * (3 / 1024 / 1024 / 1024) * dhToUsd);
}

export function costFromUsageUpload(usage: number) {
  //the usage is in bytes
  // return usage by dh
  return Number(usage * (6 / 1024 / 1024 / 1024) * dhToUsd);
}

export default formatDataSize;
