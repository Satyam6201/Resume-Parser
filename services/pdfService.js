const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const extractTextFromPDF = async (pdfBuffer) => {
  let profileImagePath = "";
  const profileDir = path.join(__dirname, "../uploads/profile");
  
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
  }

  const customPagerender = async (pageData) => {
    try {
      if (!profileImagePath && pageData.pageNumber === 1) {
        const opList = await pageData.getOperatorList();

        for (let i = 0; i < opList.fnArray.length; i++) {
          const fn = opList.fnArray[i];
          if (fn === 82 || fn === 85 || fn === 83) { 
            const args = opList.argsArray[i];
            const imgKey = args[0];
            
            try {
              const imgObj = pageData.objs.get(imgKey);
              if (imgObj && imgObj.data) {
                const imgPath = path.join(profileDir, `profile_${Date.now()}.jpg`);
                fs.writeFileSync(imgPath, Buffer.from(imgObj.data));
                profileImagePath = `uploads/profile/${path.basename(imgPath)}`;
                break; // Found one!
              }
            } catch (imgErr) {
              // Ignore image extraction errors
            }
          }
        }
      }
    } catch (e) {
      // Ignore
    }

    // Default text extraction logic from pdf-parse
    const textContent = await pageData.getTextContent();
    let lastY, text = '';
    for (const item of textContent.items) {
      if (lastY == item.transform[5] || !lastY) {
        text += item.str;
      } else {
        text += '\n' + item.str;
      }
      lastY = item.transform[5];
    }
    return text;
  };

  try {
    const data = await pdfParse(pdfBuffer, { pagerender: customPagerender });
    return {
      text: data.text,
      profileImage: profileImagePath
    };
  } catch (error) {
    throw new Error("Failed to parse PDF document.");
  }
};

module.exports = {
  extractTextFromPDF,
};