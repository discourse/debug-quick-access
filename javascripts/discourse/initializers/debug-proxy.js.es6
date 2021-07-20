import { ajax } from "discourse/lib/ajax";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "debug-proxy",

  initialize() {
    withPluginApi("0.8.31", () => {
      const body = {
        contentProvider: "contentProvider",
        contentId: "contentId",
        mediaEntityType: "mediaEntityType",
        isFullyWatched: "isFullyWatched",
      };

      ajax("/proxy/media/updateMediaWatchedTimestamp.json", {
        contentType: "application/json",
        dataType: "json",
        type: "POST",
        data: JSON.stringify(body),
      }).then((json) => {
        console.log(json);
      });
    });
  },
};
