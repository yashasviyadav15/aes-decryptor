import React, { useState } from "react";
import CryptoJS from "crypto-js";
// import TKN from './tkn'

function AESDecryptor() {
  // Hardcoded values
  const iv = CryptoJS.enc.Utf8.parse("i8as74040a064g85");
  const secretKey = CryptoJS.enc.Utf8.parse("a74ba80aced84865a73af7d53890e3s2");

  // State for input and output
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const [decryptedResponse, setDecryptedResponse] = useState(`{
    "tokenfromencrypt": "placeholder_for_encrypted_token",
    "tokenfrompaste": "placeholder_for_manual_token"
  }`);
    // const [tokenFromEncrypt, setTokenFromEncrypt] = useState("");
    const [tokenFromPaste, setTokenFromPaste] = useState("");
  // Decrypt function
  const handleDecrypt = () => {
    try {
      // Decrypt the encrypted text
      const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7, // PKCS5Padding in CryptoJS is represented as Pkcs7
      });
      const plainText = decrypted.toString(CryptoJS.enc.Utf8);

      // Parse JSON and extract access_token if the text is valid JSON
      try {
        const jsonResponse = JSON.parse(plainText);
        setDecryptedText(JSON.stringify(jsonResponse, null, 2)); // Beautify JSON
        setAccessToken(jsonResponse.access_token || "Access token not found");
      } catch (err) {
        // Handle invalid JSON
        setDecryptedText(plainText || "Invalid Cipher Text!");
        setAccessToken("N/A (Decrypted text is not valid JSON)");
      }
    } catch (error) {
      // Handle decryption errors
      setDecryptedText("Error decrypting text. Check input!");
      setAccessToken("N/A");
    }
  };
  // const handleReplaceTokens = () => {
  //   try {
  //     // Trim the input to remove any leading/trailing spaces
  //     const trimmedTokenFromPaste = tokenFromPaste.trim();
  
  //     // Regex to extract only the access_token value
  //     const accessTokenRegex = /"access_token":\s*"([^"]+)"/;
  //     const match = trimmedTokenFromPaste.match(accessTokenRegex);
  //     const accessTokens = match ? match[1] : "";
  
  //     // Update decryptedResponse with the extracted and cleaned tokens
  //     const updatedJson = JSON.parse(decryptedResponse);
  //     updatedJson.tokenfromencrypt = accessToken.trim() || "placeholder_for_encrypted_token";
  //     updatedJson.tokenfrompaste = accessTokens || "placeholder_for_manual_token";
  
  //     setDecryptedResponse(JSON.stringify(updatedJson, null, 2)); // Beautify JSON
  //   } catch (error) {
  //     alert("Invalid JSON format in the decrypted response or token!");
  //   }
  // };
  const handleReplaceTokens = () => {
    try {
      // Trim the input to remove any leading/trailing spaces
      const trimmedTokenFromPaste = tokenFromPaste.trim();
  
      // Regex to extract only the access_token value
      const accessTokenRegex = /"access_token":\s*"([^"]+)"/;
      const match = trimmedTokenFromPaste.match(accessTokenRegex);
      const accessTokens = match ? match[1] : "";
  
      // Update decryptedResponse with the extracted and cleaned tokens
      const updatedJson = JSON.parse(decryptedResponse);
      updatedJson.tokenfromencrypt = accessToken.trim() || "placeholder_for_encrypted_token";
      updatedJson.tokenfrompaste = accessTokens || "placeholder_for_manual_token";
  
      // Wrap the output with `const tokens = {...}`
      const tokensResponse = `const tokens = ${JSON.stringify(updatedJson, null, 2)};`;
  
      setDecryptedResponse(tokensResponse); // Update the decryptedResponse with the desired format
    } catch (error) {
      alert("Invalid JSON format in the decrypted response or token!");
    }
  };
  
  return (
    <>
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>AES Decryptor</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Enter Encrypted Text:</label>
        <textarea
          value={encryptedText}
          onChange={(e) => setEncryptedText(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Paste your AES encrypted text here..."
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
      </div>
      <button onClick={handleDecrypt} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Decrypt
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>Access Token:</h3>
        <textarea
          readOnly
          rows="2"
          cols="50"
          value={accessToken}
          style={{ backgroundColor: "#f5f5f5", color: "#333", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
      </div>

      {/* <div style={{ marginTop: "10px" }}>
        <h3>Complete Decrypted Response:</h3>
        <textarea
          readOnly
          rows="10"
          cols="50"
          value={decryptedText}
          style={{ backgroundColor: "#f5f5f5", color: "#333", width: "100%", padding: "8px" }}
        />
      </div> */}
    </div>
     {/* <TKN/> */}
     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Token Replacement Tool</h2>

      <div>
        <label>Token From Encrypt:</label>
        <input
          type="text"
          placeholder="Enter token from encrypt"
          value={accessToken}
          // onChange={(e) => setTokenFromEncrypt(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
      </div>

      <div>
        <label>Token From Paste:</label>
        <input
          type="text"
          placeholder="Enter token from paste"
          value={tokenFromPaste}
          onChange={(e) => setTokenFromPaste(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
      </div>
      <div>
        <label>Decrypted Response:</label>
        <textarea
          value={decryptedResponse}
          onChange={(e) => setDecryptedResponse(e.target.value)}
          rows={6}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </div>

      <button onClick={handleReplaceTokens} style={{ padding: "10px 15px", cursor: "pointer" }}>
        Replace Tokens
      </button>
    </div>
      <div style={{ marginTop: "10px" }}>
        <h3>Complete Decrypted Response:</h3>
        <textarea
          readOnly
          rows="10"
          cols="50"
          value={decryptedText}
          style={{ backgroundColor: "#f5f5f5", color: "#333", width: "100%", padding: "8px" }}
        />
      </div>
          <div>

</div>

     </>
  );
}

export default AESDecryptor;
