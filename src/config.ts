
let {
   REACT_APP_SCRAPPER_URL: scrapperAPIUrl = "http://fff.scrapper",
   REACT_APP_QUEUE_URL: queueAPIUrl = "http://fff.queue",
   REACT_APP_IMAGE_HOST_URL: imageHostAPIUrl = "http://fs-host",
   REACT_APP_DATABASE_URL: dbAPIUrl = "http://fff.mongo-server",
} = process.env;

export default {
   scrapperAPIUrl,
   queueAPIUrl,
   imageHostAPIUrl,
   dbAPIUrl,
};
