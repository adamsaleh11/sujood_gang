import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory makes Next mis-infer the workspace
  // root without this.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
