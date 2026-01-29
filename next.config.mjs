/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "loremflickr.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.antaranews.com" },
      { protocol: "https", hostname: "ichef.bbci.co.uk" },
      { protocol: "https", hostname: "akcdn.detik.net.id" },
      { protocol: "https", hostname: "cdn.cnnindonesia.com" },
      { protocol: "https", hostname: "awsimages.detik.net.id" },
      { protocol: "https", hostname: "*.bbci.co.uk" },
      { protocol: "https", hostname: "*.cnn.com" },
    ],
  },
};

export default nextConfig;
