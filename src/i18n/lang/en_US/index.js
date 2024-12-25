import common from "./common.json";
import sys from "./sys.json";

const combinedConfig = {
   ...common,
   ...sys,
};

export default combinedConfig;
