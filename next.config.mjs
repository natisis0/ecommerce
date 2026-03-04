/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "rxxhmliywjzsohaemeqg.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/Images/**",
            },
        ],
    },

  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
