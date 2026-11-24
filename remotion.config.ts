import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
Config.addElementLibrary({
    'url': 'https://www.remotion.dev/elements',
    'displayName': 'Remotion Elements'
});
