export default {
  name: "live-dev-debug",
  initialize(container) {
    const messageBus = container.lookup("message-bus:main");
    const session = container.lookup("session:main");

    // -1 is implicit, that's what we want on production
    const lastFileChangeId = session.mbLastFileChangeId || -1;

    // Observe file changes
    messageBus.subscribe(
      "/file-change",
      (data) => {
        console.log("--------");
        data.forEach((me) => {
          if (me === "refresh") {
          } else if (me.new_href && me.target) {
            console.log(me);
          }
        });
      },
      lastFileChangeId
    );
  },
};
