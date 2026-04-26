/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/penafian",
        destination: "/dasar-dasar-dan-hak-cipta#hak-cipta",
        permanent: true,
      },
      {
        source: "/dasar-privasi",
        destination: "/dasar-dasar-dan-hak-cipta#dasar-privasi",
        permanent: true,
      },
      {
        source: "/dasar-keselamatan",
        destination: "/dasar-dasar-dan-hak-cipta#dasar-keselamatan",
        permanent: true,
      },
      {
        source: "/hak-cipta",
        destination: "/dasar-dasar-dan-hak-cipta#hak-cipta",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
