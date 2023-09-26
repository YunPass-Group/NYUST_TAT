export default function extractStudentData(htmlContent) {
    let data = {};

    // Specific extraction for the addresses and image source
    const patterns = {
        "LIVE_ZIP_CODE": /<span id="[^"]*_LIVE_ZIP_CODELabel"[^>]*>([^<]*)<\/span>/,
        "LIVE_ADDRESS": /<span id="[^"]*_LIVE_ADDRESSLabel"[^>]*>([^<]*)<\/span>/,
        "MAIL_ZIP_CODE": /<span id="[^"]*_MAIL_ZIP_CODELabel"[^>]*>([^<]*)<\/span>/,
        "MAIL_ADDRESS": /<span id="[^"]*_MAIL_ADDRESSLabel"[^>]*>([^<]*)<\/span>/,
        "ImageSrc": /<img id="[^"]*_studPhotoImage"[^>]*src="([^"]+)"/,
    };

    for (let key in patterns) {
        let match = htmlContent.match(patterns[key]);
        if (match) {
            data[key] = match[1].trim();
        }
    }

    // Prepend the base URL to ImageSrc and decode HTML entities
    if (data["ImageSrc"]) {
        data["ImageSrc"] = "https://webapp.yuntech.edu.tw" + data["ImageSrc"];
        data["ImageSrc"] = data["ImageSrc"].replace(/&amp;/g, '&');
    }

    // Using regex to get values for span tags with IDs matching the pattern, excluding the ADDRESS key
    let matches = htmlContent.matchAll(/<span id="[^"]*_([a-zA-Z]+)Label"[^>]*>([^<]*)<\/span>/g);
    for (let match of matches) {
        let key = match[1];
        if (key !== "ADDRESS") {
            data[key] = match[2].trim();
        }
    }

    return data;
}