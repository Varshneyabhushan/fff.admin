export function validateUrl(urlString: string): [null | URL, string] {
   try {
      let url = new URL(urlString);
      if (url.protocol !== "http:" && url.protocol !== "https:")
         return [null, "protocol must be http"];

      return [url, ""];
   } catch (e) {
      return [null, "not a valid url"];
   }
}

export function getTitleFromURL(url: string) {
   let lastSlashIndex = url.lastIndexOf("/");
   return url.slice(lastSlashIndex + 1);
}

export function isValidURL(urlString: string) {
   let [url, error] = validateUrl(urlString);
   return url === null ? error : true;
}
