import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

// ✅ Ensure AWS Amplify is properly initialized
Amplify.configure({ ...awsExports, ssr: true });

export default Amplify;
