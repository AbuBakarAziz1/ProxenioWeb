/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'el'], // 'el' is the code for Greek
    defaultLocale: 'en',
  },

  images: {
    domains: ["hxiyreseb36fxlmg.public.blob.vercel-storage.com"],
  },
};

export default nextConfig;
