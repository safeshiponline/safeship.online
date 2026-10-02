import { Config } from "@remotion/cli/config";

// Serve public directory for static audio/images
Config.setPublicDir("./public");

// Output video configuration
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
