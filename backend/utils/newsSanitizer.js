// const TRUSTED_DOMAINS = [
//     "cnbc.com",
//     "reuters.com",
//     "bloomberg.com",
//     "wsj.com",
//     "ft.com",
//     "techcrunch.com",
//     "theverge.com",
//   ];
  
//   function normalizeImage(image) {
//     if (!image) return null;
  
//     // Reject base64 images
//     if (image.startsWith("data:image")) {
//       return null;
//     }
  
//     try {
//       new URL(image);
//       return image;
//     } catch {
//       return null;
//     }
//   }
  
//   function isTrustedSource(url) {
//     try {
//       const hostname = new URL(url).hostname;
  
//       return TRUSTED_DOMAINS.some((domain) =>
//         hostname.includes(domain)
//       );
//     } catch {
//       return false;
//     }
//   }
  
//   module.exports = {
//     normalizeImage,
//     isTrustedSource,
//   };



const TRUSTED_DOMAINS = [
    "cnbc.com",
    "reuters.com",
    "bloomberg.com",
    "wsj.com",
    "ft.com",
    "techcrunch.com",
    "theverge.com",
  ];
  
  export const normalizeImage = (image) => {
    if (!image) return null;
  
    // Reject base64 images
    if (image.startsWith("data:image")) {
      return null;
    }
  
    try {
      new URL(image);
      return image;
    } catch {
      return null;
    }
  };
  
  export const isTrustedSource = (url) => {
    try {
      const hostname = new URL(url).hostname;
  
      return TRUSTED_DOMAINS.some((domain) =>
        hostname.includes(domain)
      );
    } catch {
      return false;
    }
  };