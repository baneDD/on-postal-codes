const fs = require("fs");
const postalCodes = require("./postal_codes.json");

const outputFileDirectory = "./fsa";
const pcdByFsa = {};

postalCodes.map((pcd) => {
  const fsa = pcd.postcode.slice(0, 3).toUpperCase();

  if (!pcdByFsa[fsa]) {
    pcdByFsa[fsa] = {};
  }

  pcdByFsa[fsa][pcd.postcode.slice(3).toUpperCase()] = { lat: pcd.latitude, lng: pcd.longitude };
});

createNewOutputFolder(outputFileDirectory);

for (const fsa in pcdByFsa) {
  fs.writeFileSync(`fsa/${fsa}.json`, JSON.stringify(pcdByFsa[fsa]));
}

function createNewOutputFolder(folderName) {
  // If there is an output folder under the same name, we rename it
  if (fs.existsSync(outputFileDirectory)) {
    renameExistingOutputFolder(outputFileDirectory);
  }

  try {
    fs.mkdirSync(folderName);
    console.log(`Successfully created output directory "${folderName}".`);
  } catch (err) {
    console.error(err);
  }
}

function renameExistingOutputFolder(folderName) {
  const newFolderName = `${folderName}_${Date.now()}`;

  try {
    fs.renameSync(folderName, newFolderName);
    console.log(`Successfully renamed existing output directory "${folderName}" to "${newFolderName}".`);
  } catch (err) {
    console.error(err);
  }
}
