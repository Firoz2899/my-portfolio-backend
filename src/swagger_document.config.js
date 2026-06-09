import path from 'path';
import fs from "fs";
import { fileURLToPath } from 'url';
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yaml"), "utf8");

let finalSwaggerFile = file?.replace(
  "- url: ${{server}}",
  `- url: http://localhost:3000/api/v1`
)
finalSwaggerFile = finalSwaggerFile?.replace(
  "${{title}}",
  "Profile Apis Docs"
)
finalSwaggerFile = finalSwaggerFile?.replace(
  "${{description}}",
  "API documentation for the Profile application"
)
const swaggerDocument = YAML.parse(
  finalSwaggerFile
);

export default swaggerDocument;