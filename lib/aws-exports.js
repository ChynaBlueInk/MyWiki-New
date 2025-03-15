const awsExports = {
  Auth: {
    region: "ap-southeast-2",
    userPoolId: "ap-southeast-2_26XbCjC5b",
    userPoolWebClientId: "6thnjit178pmgt3g0qa6g04tmf", // Replace with the new App Client ID
    mandatorySignIn: true,
    authenticationFlowType: "USER_PASSWORD_AUTH",
    oauth: undefined // ✅ Ensures OAuth is fully disabled
  },
};

export default awsExports;
